import { getFullLinkedinProfile } from '@/server/linkedin';
export const POST = async ({ request }) => {
	const { linkedinHandle } = await request.json();

	if (!linkedinHandle) {
		return new Response('No linkedinHandle provided', { status: 400 });
	}

	const candidate = await getFullLinkedinProfile(linkedinHandle);
	return new Response(JSON.stringify(candidate), { status: 201 });
};
