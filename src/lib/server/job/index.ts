import { generateObject } from 'ai';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { embedText, gpt4o } from '$lib/server/ai';
import { generateJobPostEmbeddingInput } from '$lib/server/ai/format';
import { db } from '$lib/server/db';
import { candidates, jobPost, linkedInProfile } from '$lib/server/db/schema';
import { getFullLinkedinProfile } from '$lib/server/linkedin';

export interface JobData {
	title: string;
	description: string;
	department?: string;
	location?: string;
	type?: string;
	priority?: string;
	salary?: string;
	remote_policy?: string;
	responsibilities?: string;
	requirements?: string;
	benefits?: string;
	tech_stack?: string;
}

export async function insertJob(
	jobData: string,
	userId: string,
	ownerId?: string,
	status?: 'archived' | 'draft' | 'published'
) {
	const { object } = await generateObject({
		model: gpt4o,
		schema: z.object({
			title: z.string(),
			description: z.string(),
			department: z.string().optional(),
			location: z.string().optional(),
			type: z.string().optional(),
			priority: z.string().optional(),
			salary: z.string().optional(),
			remote_policy: z.string().optional(),
			responsibilities: z.string().optional(),
			requirements: z.string().optional(),
			benefits: z.string().optional(),
			tech_stack: z.string().optional()
		}),
		prompt: `Extract the following information from the job description: ${jobData}. Please don't include any company information in the job description.`
	});

	const stringForVector = generateJobPostEmbeddingInput(object);
	const vector = await embedText(stringForVector);

	try {
		const post = await db
			.insert(jobPost)
			.values({
				userId,
				ownerId: ownerId || userId,
				title: object.title,
				department: object.department,
				location: object.location,
				type: object.type,
				status,
				priority: object.priority,
				salary: object.salary,
				vector,
				description: object.description,
				responsibilities: object.responsibilities,
				requirements: object.requirements,
				benefits: object.benefits,
				tech_stack: object.tech_stack,
				remote_policy: object.remote_policy
			})
			.returning();

		return post[0];
	} catch (error) {
		throw new Error(
			`Failed to insert job: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function addCandidate(
	linkedinHandle: string,
	jobId: string,
	matchScore?: number,
	reasoning?: string,
	eagerlyAdded: boolean = false
) {
	try {
		const job = await db.query.jobPost.findFirst({
			where: eq(jobPost.id, jobId)
		});

		if (!job) {
			throw new Error(`Job with ID ${jobId} not found`);
		}

		const profileEntry = await db.query.linkedInProfile.findFirst({
			where: eq(linkedInProfile.handle, linkedinHandle)
		});

		let profileId: string;

		if (profileEntry) {
			profileId = profileEntry.id;
		} else {
			// Fetch profile data
			try {
				const profileData = await getFullLinkedinProfile(linkedinHandle);

				if (!profileData) {
					throw new Error('Failed to fetch LinkedIn profile');
				}
				const newProfile = await db
					.insert(linkedInProfile)
					.values({
						handle: linkedinHandle,
						data: profileData,
						expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days expiry
					})
					.returning({ id: linkedInProfile.id });

				if (!newProfile || newProfile.length === 0) {
					throw new Error('Failed to create LinkedIn profile entry');
				}
				profileId = newProfile[0].id;
			} catch (error) {
				return { error: `LinkedIn profile not found: ${linkedinHandle}` };
			}
		}

		// Check if candidate already exists for this job
		const existingCandidate = await db.query.candidates.findFirst({
			where: (candidates, { and }) =>
				and(eq(candidates.jobPostId, jobId), eq(candidates.linkedInProfileId, profileId)),
			with: {
				linkedInProfile: true
			}
		});

		if (existingCandidate) {
			return existingCandidate;
		}

		// Create new candidate entry
		const newCandidate = await db
			.insert(candidates)
			.values({
				jobPostId: jobId,
				linkedInProfileId: profileId,
				matchScore: matchScore,
				reasoning: reasoning,
				eagerlyAdded: eagerlyAdded
			})
			.returning();

		if (!newCandidate || newCandidate.length === 0) {
			throw new Error('Failed to add candidate to job post');
		}

		// Return the created candidate with profile information
		return {
			...newCandidate[0],
			linkedInProfile: { handle: linkedinHandle }
		};
	} catch (error) {
		throw new Error(
			`Failed to add candidate: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}
