import { runWorkFlow } from '@/server/ai/mastra/workflows';

export const POST = async ({ request }) => {
	const { query } = await request.json();

	// Create a workflow run instance
	const result = await runWorkFlow(query);

	console.log(result);

	// Start the workflow with the query as trigger data

	return new Response(JSON.stringify(result), { status: 200 });
};
