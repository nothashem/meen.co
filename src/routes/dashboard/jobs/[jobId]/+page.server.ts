import { error } from '@sveltejs/kit';
import { and, asc, eq } from 'drizzle-orm';

import { chat, chatMessage, jobPost } from '@/server/db/schema';
import { db } from '$lib/server/db';
export const load = async ({ locals, params }) => {
	const job = await db.query.jobPost.findFirst({
		where: and(eq(jobPost.id, params.jobId), eq(jobPost.ownerId, locals.user.id)),
		with: {
			candidates: {
				with: {
					linkedInProfile: true
				}
			},
			chat: {
				with: {
					messages: {
						with: {
							toolcalls: true
						},
						orderBy: asc(chatMessage.createdAt)
					}
				}
			}
		}
	});

	if (!job) {
		throw error(404, 'Job not found');
	}
	if (!job?.chat) {
		await db.insert(chat).values({
			jobPostId: job.id,
			title: 'Recruiter Agent'
		});
	}
	return { job };
};
