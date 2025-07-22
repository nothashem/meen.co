import axios from 'axios';

import { GOOGLE_CSE_ID, GOOGLE_SEARCH_API_KEY } from '$env/static/private';
type GoogleSearchResult = {
	items: {
		link: string;
		title: string;
		snippet: string;
	}[];
};

export async function searchGoogle(query: string): Promise<GoogleSearchResult> {
	// Read the API key and Custom Search Engine (CSE) ID from environment variables
	const apiKey = GOOGLE_SEARCH_API_KEY;
	const cx = GOOGLE_CSE_ID;

	if (!apiKey || !cx) {
		throw new Error('Missing GOOGLE_SEARCH_API_KEY or GOOGLE_CSE_ID environment variables.');
	}

	// Construct the request URL with the query parameter, API key, and CSE id
	const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

	const response = await axios.get(url);
	console.log('response', response.data);
	return response.data;
}

import { z } from 'zod';

import { env } from '$env/dynamic/private';

const CRAWL4AI_BASE_URL = 'http://localhost:11235'; // Use correct port
const CRAWL4AI_API_TOKEN = env.CRAWL4AI_API_TOKEN || 'secret'; // Use env var or default

const goToUrlOutputSchema = z.object({
	markdown: z
		.string()
		.describe('The processed content of the webpage in Markdown format.')
		.optional(),
	fetchedUrl: z.string().url().describe('The URL that was fetched.')
});

// Define an expected structure for the crawl result data (can be reused or adapted)
interface CrawlResultData {
	markdown?: string;
	// Add other potential fields if known
}

// Reusable polling function (could be moved to a shared utils file)
async function pollTaskResult(taskId: string): Promise<CrawlResultData | null> {
	const maxAttempts = 10;
	const delay = 2000; // 2 seconds

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			const response = await axios.get(`${CRAWL4AI_BASE_URL}/task/${taskId}`, {
				headers: { Authorization: `Bearer ${CRAWL4AI_API_TOKEN}` }
			});

			if (response.data) {
				// console.log(`[pollTaskResult] Task ${taskId} status: ${response.data.status}`);
				if (response.data.status === 'completed') {
					return typeof response.data.result === 'object' && response.data.result !== null
						? response.data.result
						: {};
				} else if (response.data.status === 'failed') {
					// console.error(`[pollTaskResult] Task ${taskId} failed:`, response.data.error);
					throw new Error(`Crawl task ${taskId} failed: ${response.data.error || 'Unknown error'}`);
				}
			}
			// else {
			// 	console.warn(
			// 		`[pollTaskResult] Unexpected response structure for task ${taskId}:`,
			// 		response.data
			// 	);
			// }
		} catch (error: unknown) {
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				// console.warn(`[pollTaskResult] Task ${taskId} not found (yet?), attempt ${attempt + 1}`);
			} else {
				// console.error(
				// 	`[pollTaskResult] Error polling task ${taskId}, attempt ${attempt + 1}:`,
				// 	error
				// );
				if (attempt === maxAttempts - 1) {
					if (error instanceof Error) throw error;
					else throw new Error(`Polling failed for task ${taskId} after ${maxAttempts} attempts.`);
				}
			}
		}
		await new Promise((resolve) => setTimeout(resolve, delay));
	}

	throw new Error(`Crawl task ${taskId} did not complete within the timeout period.`);
}

export async function gotoURL(url: string) {
	const crawlRequestPayload = {
		urls: url
	};

	const crawlResponse = await axios.post(`${CRAWL4AI_BASE_URL}/crawl`, crawlRequestPayload, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${CRAWL4AI_API_TOKEN}`
		}
	});

	if (!crawlResponse.data || !crawlResponse.data.task_id) {
		// console.error('[goToUrl] Failed to get task_id from crawl request:', crawlResponse.data);
		throw new Error('Failed to initiate crawl: No task_id received.');
	}

	const taskId: string = crawlResponse.data.task_id;
	// console.log(`[goToUrl] Crawl task initiated with ID: ${taskId}`);

	// Step 2: Poll for result
	const resultData = await pollTaskResult(taskId);

	// console.log(`[goToUrl] Crawl task ${taskId} completed successfully for URL: ${url}`);

	const output: z.infer<typeof goToUrlOutputSchema> = {
		markdown: resultData?.markdown || 'No markdown content extracted.',
		fetchedUrl: url
	};

	goToUrlOutputSchema.parse(output); // Validate output

	return output;
}

export async function getJobDataFromURL(url: string) {
	const response = await gotoURL(url);
	return response.markdown;
}
