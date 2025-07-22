import type { RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { embedText } from '$lib/server/ai';
import { generateJobPostEmbeddingInput } from '$lib/server/ai/format';
import { db } from '$lib/server/db';
import { jobPost } from '$lib/server/db/schema';
import { insertJob } from '$lib/server/job';
import { getJobDataFromURL } from '$lib/server/search/index';

export const POST = async ({ request, locals }: RequestEvent) => {
	try {
		console.log('Starting job creation from URL');
		const { url } = await request.json();
		console.log(`Processing URL: ${url}`);

		const jobData = await getJobDataFromURL(url);
		if (!jobData) {
			console.log('No job data found from URL');
			return new Response(
				JSON.stringify({ error: 'Failed to create job', details: 'No job data found' }),
				{
					status: 400
				}
			);
		}
		console.log('Job data extracted successfully');

		console.log(`Inserting job for user: ${locals.user.id}`);
		const job = await insertJob(jobData, locals.user.id);
		console.log(`Job created with ID: ${job.id}`);

		const formattedJobData = generateJobPostEmbeddingInput({
			title: job.title,
			description: job.description,
			department: job.department || undefined,
			location: job.location || undefined,
			type: job.type || undefined,
			priority: job.priority || undefined,
			salary: job.salary as string | undefined,
			remote_policy: job.remote_policy || undefined,
			responsibilities: job.responsibilities as string | undefined,
			requirements: job.requirements as string | undefined,
			benefits: job.benefits as string | undefined,
			tech_stack: job.tech_stack as string | undefined
		});
		console.log('Generating embeddings for job data');
		await embedText(formattedJobData);
		console.log('Job data:', job);

		/*/
		console.log('Searching LinkedIn for matching candidates');
		const candidates = await searchLinkedinForObject(job.description);
		console.log(`Found ${candidates.length} potential candidates`);

		// De-duplicate candidates by URL
		const uniqueCandidates = Array.from(
			new Map(candidates.map((candidate) => [candidate.handle, candidate])).values()
		);
		console.log(`Filtered to ${uniqueCandidates.length} unique candidates`);

		console.log(
			'Candidate names:',
			uniqueCandidates.map((candidate) => candidate.data.full_name)
		);

		console.log('Adding candidates to job');
		await Promise.all(
			uniqueCandidates.map((candidate) => {
				console.log(`Adding candidate: ${candidate.data.full_name} (${candidate.handle})`);
				return addCandidate(
					candidate.handle,
					job.id,
					10,
					'Eagerly matched candidate based on job description',
					true
				);
			})
		);
		console.log('All candidates added successfully');
		/*/

		return new Response(JSON.stringify(job), { status: 201 });
	} catch (error) {
		console.error('Error creating job:', error);
		return new Response(JSON.stringify({ error: 'Failed to create job', details: error }), {
			status: 500
		});
	}
};

export const PATCH = async ({ request, locals }: RequestEvent) => {
	console.log('Starting job update');
	const { id, title, description } = await request.json();
	console.log(`Updating job ${id} for user ${locals.user.id}`);
	const user = locals.user;
	const post = await db
		.update(jobPost)
		.set({ title, description })
		.where(and(eq(jobPost.id, id), eq(jobPost.userId, user.id)));
	console.log('Job updated successfully');
	return new Response(JSON.stringify(post), { status: 200 });
};
