import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { searchLinkedin } from '@/server/linkedin';

export async function createSearchLinkedinTool() {
	return createTool({
		id: 'search-linkedin',
		description:
			"Search for candidates on LinkedIn. Don't include company name in the query. Only other descriptive information.",
		inputSchema: z.object({
			query: z
				.string()
				.describe(
					'Search query. Used for vector search on linkedin profiles. All data is embedded and stored in the database.'
				),
			k: z
				.number()
				.describe('Number of results to return. Default this to 50 so you can get a good sample.')
		}),
		outputSchema: z.object({
			results: z.array(z.string())
		}),
		execute: async ({ context }) => {
			console.log('searchLinkedin', context.query, context.k);
			return await searchLinkedin(context.query, context.k);
		}
	});
}
