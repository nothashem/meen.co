import { z } from 'zod';

import { waitListEmail } from '@/server/mail';

const waitlistSchema = z.object({
	email: z.string().email(),
	name: z.string().optional(),
	company: z.string().optional(),
	companySize: z.string().optional(),
	role: z.string().optional()
});

export const POST = async ({ request }) => {
	const body = await request.json();
	const { email, name, company, companySize, role } = waitlistSchema.parse(body);
	if (email) {
		await waitListEmail(email, name, company, companySize, role);
	}
	return new Response(JSON.stringify({ message: 'Email sent' }), { status: 200 });
};
