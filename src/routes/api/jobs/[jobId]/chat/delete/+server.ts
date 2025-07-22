import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { chat, jobPost } from '@/server/db/schema';

export const POST = async ({ locals, params }) => {
	const jobId = params.jobId;
	const user = locals.user;

	const userHasAccess = await db.query.jobPost.findFirst({
		where: and(eq(jobPost.id, jobId), eq(jobPost.ownerId, user.id))
	});
	if (!userHasAccess) {
		return json({ error: 'You do not have access to this job' }, { status: 403 });
	}
	await db.delete(chat).where(and(eq(chat.jobPostId, jobId), eq(chat.title, 'Recruiter Agent')));

	return json({ message: 'Chat deleted' }, { status: 200 });
};
