import { Buffer } from 'buffer';
import { eq } from 'drizzle-orm';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import ProxycurlApi, { type PersonEndpointResponse } from 'proxycurl-js-linkedin-profile-scraper';

import { PROXYCURL_API_KEY } from '$env/static/private';
import { embedText } from '$lib/server/ai';
import { generateLinkedInProfileEmbeddingInput } from '$lib/server/ai/format';
import { db } from '$lib/server/db';

import { linkedInProfile } from '../db/schema';

const defaultClient = ProxycurlApi.ApiClient.instance;
const BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.accessToken = PROXYCURL_API_KEY;

export async function getFullLinkedinProfile(
	handle: string = 'makkadotgg'
): Promise<PersonEndpointResponse> {
	try {
		// Check if profile exists in database first
		const cache = await db.query.linkedInProfile.findFirst({
			where: eq(linkedInProfile.handle, handle)
		});

		// If profile exists in cache, return it immediately without fetching
		if (cache) {
			console.log(`Using cached LinkedIn profile for ${handle}`);
			return cache.data as PersonEndpointResponse;
		}

		// Profile not in cache, fetch from Proxycurl API
		console.log(`Fetching LinkedIn profile for ${handle} from API`);
		const apiInstance = new ProxycurlApi.PeopleAPIApi();
		const fallbackToCache = 'on-error';
		const opts = {
			useCache: 'if-present',
			skills: 'include',
			inferredSalary: 'include',
			personalEmail: 'include',
			personalContactNumber: 'include',
			twitterProfileId: 'include',
			facebookProfileId: 'include',
			githubProfileId: 'include',
			extra: 'include'
		};

		let profile: PersonEndpointResponse | null = null;

		try {
			profile = await new Promise<PersonEndpointResponse>((resolve, reject) => {
				apiInstance.personProfileEndpoint(
					handle,
					fallbackToCache,
					opts,
					(error: unknown, data: PersonEndpointResponse | null) => {
						if (error) {
							reject(error);
						} else if (data) {
							resolve(data);
						} else {
							reject(new Error('No data received from Proxycurl API'));
						}
					}
				);
			});
		} catch (error) {
			throw new Error(
				`Failed to fetch LinkedIn profile: ${error instanceof Error ? error.message : String(error)}`
			);
		}

		const textToEmbed = generateLinkedInProfileEmbeddingInput(profile);
		const vector = await embedText(textToEmbed);

		let profileImageB64: string | null = null;
		if (profile.profile_pic_url) {
			try {
				const response = await fetch(profile.profile_pic_url);
				if (response.ok) {
					const imageBuffer = await response.arrayBuffer();
					profileImageB64 = Buffer.from(imageBuffer).toString('base64');
				}
			} catch (error) {
				console.error(
					`Failed to fetch profile image: ${error instanceof Error ? error.message : String(error)}`
				);
				// Continue without the image
			}
		}

		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

		await db
			.insert(linkedInProfile)
			.values({
				handle,
				data: profile,
				profileImageB64,
				vector,
				expiresAt
			})
			.onConflictDoUpdate({
				target: linkedInProfile.handle,
				set: {
					data: profile,
					profileImageB64,
					vector: vector,
					expiresAt: expiresAt,
					updatedAt: new Date()
				}
			});

		return profile;
	} catch (error) {
		console.error(
			`Error in getFullLinkedinProfile: ${error instanceof Error ? error.message : String(error)}`
		);
		throw new Error(
			`Failed to process LinkedIn profile: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function searchLinkedin(query: string, k: number = 10) {
	try {
		const embedding = await embedText(query);

		const similarity = sql<number>`1 - (${cosineDistance(linkedInProfile.vector, embedding)})`;

		const candidates = await db
			.select({
				id: linkedInProfile.id,
				data: linkedInProfile.data,
				handle: linkedInProfile.handle,
				similarity
			})
			.from(linkedInProfile)
			.where(gt(similarity, 0.0))
			.orderBy((t) => desc(t.similarity))
			.limit(k);

		const data = candidates.map((candidate) => {
			return candidate.data as PersonEndpointResponse;
		});

		const formattedData = data.map((candidate) => {
			return generateLinkedInProfileEmbeddingInput(candidate);
		});

		return {
			results: formattedData
		};
	} catch (error) {
		console.error(
			`Error in searchLinkedin: ${error instanceof Error ? error.message : String(error)}`
		);
		throw new Error(
			`Failed to search LinkedIn profiles: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function searchLinkedinForObject(query: string) {
	try {
		const embedding = await embedText(query);

		const similarity = sql<number>`1 - (${cosineDistance(linkedInProfile.vector, embedding)})`;

		const candidates = await db
			.select({
				id: linkedInProfile.id,
				data: linkedInProfile.data,
				handle: linkedInProfile.handle,
				similarity
			})
			.from(linkedInProfile)
			.where(gt(similarity, 0.0))
			.orderBy((t) => desc(t.similarity))
			.limit(2);

		console.log(
			candidates.map((candidate) => (candidate.data as PersonEndpointResponse).full_name)
		);

		return candidates;
	} catch (error) {
		console.error(
			`Error in searchLinkedinForObject: ${error instanceof Error ? error.message : String(error)}`
		);
		throw new Error(
			`Failed to search LinkedIn profiles for object: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}
