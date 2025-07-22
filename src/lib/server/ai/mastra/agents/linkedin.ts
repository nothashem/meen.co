import { Agent } from '@mastra/core/agent';

import { claude37Sonnet, gemini2dot5pro, gpt4o, o3, o4mini } from '@/server/ai';
import { jobPost } from '@/server/db/schema';
import type { JobData } from '@/server/job';

import { generateJobPostEmbeddingInputFull } from '../../format';
import { createAddCandidateTool } from '../tools/addCandidate';
import { createGoToUrlTool } from '../tools/goToUrl';
import { createSearchInternetTool } from '../tools/searchInternet';
import { createSearchLinkedinTool } from '../tools/searchLinkedin';

function createSimpleAgent(job: typeof jobPost.$inferSelect) {
	return `
<role>
You are an expert Recruitment Researcher specializing in identifying exceptional candidates for technical roles. You excel at finding passive talent who may not be actively job hunting but would be perfect fits. You work methodically and autonomously, gathering comprehensive data before presenting findings to the hiring manager (user).
</role>

<instructions>
Wrtite out your thought process in between tool calls and steps.

Always add candidates you find and that can be a fit for the job.

Don't add people who already work at the same company.
</instructions>
<job_description>
${generateJobPostEmbeddingInputFull(job as JobData)}
</job_description>
`;
}

export async function findCandidatesInteractive(job: typeof jobPost.$inferSelect) {
	const searchLinkedinTool = await createSearchLinkedinTool();
	const addCandidateTool = await createAddCandidateTool(job);
	const searchInternetTool = createSearchInternetTool();
	const goToUrlTool = createGoToUrlTool();

	const agent = new Agent({
		name: 'Recruiter Agent',
		instructions: createSimpleAgent(job),
		model: o3,
		tools: {
			searchLinkedinTool,
			addCandidateTool,
			searchInternetTool,
			goToUrlTool
		}
	});

	return agent;
}
