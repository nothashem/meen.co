import { createTool } from '@mastra/core/tools';
import axios from 'axios';
import { z } from 'zod';

import { env } from '$env/dynamic/private';

const CRAWL4AI_BASE_URL = 'http://localhost:11235'; // Use correct port
const CRAWL4AI_API_TOKEN = env.CRAWL4AI_API_TOKEN || 'secret'; // Use env var or default

const goToUrlInputSchema = z.object({
	url: z.string().describe('The URL to fetch content from (cannot be a LinkedIn URL).')
});

const goToUrlOutputSchema = z.object({
	markdown: z
		.string()
		.describe('The processed content of the webpage in Markdown format.')
		.optional(),
	fetchedUrl: z.string().describe('The URL that was fetched.')
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

export function createGoToUrlTool() {
	return createTool({
		id: 'goToUrl',
		description:
			'Fetches and processes the content of a given URL using crawl4ai. Returns the content in Markdown format. IMPORTANT: This tool cannot be used to access LinkedIn URLs.',
		inputSchema: goToUrlInputSchema,
		outputSchema: goToUrlOutputSchema,
		execute: async ({ context }: { context: z.infer<typeof goToUrlInputSchema> }) => {
			const { url } = context;

			console.log('goToUrl', url);
			if (url.includes('linkedin.com')) {
				throw new Error('Accessing LinkedIn URLs directly is not permitted with this tool.');
			}

			// console.log(`[goToUrl] Requesting crawl for URL: ${url}`);

			try {
				// Step 1: Initiate crawl
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
			} catch (error: unknown) {
				// console.error(`[goToUrl] Error during crawl process for ${url}:`, error);
				if (error instanceof Error) {
					throw new Error(`Failed goToUrl process: ${error.message}`);
				} else {
					throw new Error(`An unknown error occurred during the goToUrl process: ${String(error)}`);
				}
			}
		}
	});
}
