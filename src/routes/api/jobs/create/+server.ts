import type { RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { embedText } from '@/server/ai';
import { db } from '@/server/db';
import { jobPost } from '@/server/db/schema';
import type { Job } from '@/types/job';

export const POST = async ({ request, locals }: RequestEvent) => {
	try {
		const jobData: Job = await request.json();

		if (!locals.user) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
		}

		const user = locals.user;
		const stringForVector = `${jobData.title} ${jobData.description}`;
		const vector = await embedText(stringForVector);

		try {
			const post = await db.insert(jobPost).values({
				userId: user.id,
				ownerId: user.id,
				title: jobData.title,
				department: jobData.department,
				location: jobData.location,
				type: jobData.type,
				status: jobData.status || 'draft',
				priority: jobData.priority,
				salary: jobData.salary,
				vector: vector,
				description: jobData.description,
				responsibilities: jobData.responsibilities,
				requirements: jobData.requirements,
				benefits: jobData.benefits,
				tech_stack: jobData.tech_stack,
				remote_policy: jobData.remote_policy
			});

			return new Response(JSON.stringify(post), { status: 201 });
		} catch (dbError: any) {
			console.error('Database error:', dbError);
			return new Response(JSON.stringify({ error: 'Database error', details: dbError.message }), {
				status: 500
			});
		}
	} catch (error: any) {
		console.error('Error creating job:', error);
		return new Response(JSON.stringify({ error: 'Failed to create job', details: error.message }), {
			status: 500
		});
	}
};

export const PATCH = async ({ request, locals }: RequestEvent) => {
	const { id, title, description } = await request.json();
	const user = locals.user;
	const post = await db
		.update(jobPost)
		.set({ title, description })
		.where(and(eq(jobPost.id, id), eq(jobPost.userId, user.id)));
	return new Response(JSON.stringify(post), { status: 200 });
};
