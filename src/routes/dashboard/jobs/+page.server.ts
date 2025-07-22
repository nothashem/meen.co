import { eq } from 'drizzle-orm';

import { jobPost } from '@/server/db/schema';
import { db } from '$lib/server/db';

export const load = async ({ locals }) => {
	return {
		streamed: {
			jobs: db.query.jobPost.findMany({
				where: eq(jobPost.userId, locals.user.id),
				limit: 10,
				orderBy: (jobPost, { desc }) => [desc(jobPost.createdAt)]
			})
		}
	};
};
