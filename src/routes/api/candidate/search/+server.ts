import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

import { embedText } from '@/server/ai';
import { db } from '@/server/db';
import { linkedInProfile } from '@/server/db/schema';

export const POST = async ({ request }) => {
	const { query } = await request.json();

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

	return new Response(JSON.stringify(candidates), { status: 200 });
};
