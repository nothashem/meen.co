import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { searchGoogle } from '@/server/search';

const searchInternetInputSchema = z.object({
	query: z.string().describe('The search query to use for Google.')
});
const searchInternetOutputSchema = z.object({
	data: z.array(
		z.object({
			kind: z.string().optional(),
			title: z.string(),
			htmlTitle: z.string().optional(),
			link: z.string().url(),
			displayLink: z.string().optional(),
			snippet: z.string(),
			htmlSnippet: z.string().optional(),
			formattedUrl: z.string().optional(),
			htmlFormattedUrl: z.string().optional(),
			pagemap: z.record(z.any()).optional()
		})
	),
	url: z.string().url().describe('The Google search URL used.')
});

export function createSearchInternetTool() {
	return createTool({
		id: 'searchInternet',
		description:
			'Searches the internet using Google and returns the processed content of the search results page. Useful for finding general information, news, or resources online.',
		inputSchema: searchInternetInputSchema,
		outputSchema: searchInternetOutputSchema,
		execute: async ({ context }) => {
			const { query } = context;

			const results = await searchGoogle(query);
			console.log('searchInternet', results);
			return {
				data: results.items,
				url: `https://www.google.com/search?q=${query}`
			};
		}
	});
}
