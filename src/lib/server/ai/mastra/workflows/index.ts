import { Step, Workflow } from '@mastra/core/workflows';
import { z } from 'zod'; // Assuming zod for schema validation as per docs

import { getFullLinkedinProfile } from '@/server/linkedin';
import { searchGoogle } from '$lib/server/search';
// --- Helper Functions ---

// Performs the actual Google Search API call
async function performGoogleSearch(query: string): Promise<{ searchResults: any }> {
	const results = await searchGoogle(query + ' linkedin');
	console.log('results', results);
	return {
		searchResults: results
	};
}

// Implementation of the missing parseAndValidateResults function
async function parseAndValidateResults(
	resultsToProcess: any,
	currentCandidates: Array<{ id: string }>
): Promise<{
	newCandidates: Array<{ id: string }>;
	updatedCandidateList: Array<{ id: string }>;
}> {
	// Extract candidate information from search results
	const newCandidates: Array<{ id: string }> = [];

	// Parse results and extract LinkedIn profile IDs from items
	if (resultsToProcess && resultsToProcess.items) {
		for (const item of resultsToProcess.items) {
			if (item.link && item.link.includes('linkedin.com/in/')) {
				const match = item.link.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/);
				if (match && match[1]) {
					const candidateId = match[1];
					// Check if candidate already exists
					if (!currentCandidates.some((c) => c.id === candidateId)) {
						newCandidates.push({ id: candidateId });
					}
				}
			}
		}
	}

	// Combine existing and new candidates
	const updatedCandidateList = [...currentCandidates, ...newCandidates];

	return {
		newCandidates,
		updatedCandidateList
	};
}

// Helper function to fetch a profile
async function fetchProfileFromAPI(candidateId: string) {
	// Construct LinkedIn URL from ID
	const linkedinUrl = `https://linkedin.com/in/${candidateId}`;
	// Use the existing fetchProfile step's logic
	const profileData = await getFullLinkedinProfile(linkedinUrl);
	return profileData;
}

// --- Mastra Steps ---

// 1. Step to perform the Google Search
const googleSearchStep = new Step({
	id: 'googleSearch',
	inputSchema: z.object({
		searchQuery: z.string()
	}),
	outputSchema: z.object({
		rawResults: z.any()
	}),
	execute: async ({ context }) => {
		const searchQuery = context.triggerData?.initialQuery;
		console.log('googleSearchStep', searchQuery);

		const { searchResults } = await performGoogleSearch(searchQuery);
		console.log('results', searchResults);
		return { rawResults: searchResults };
	}
});

// 2. Step to process search results and manage state
const processResultsStep = new Step({
	id: 'processResults',
	inputSchema: z.object({
		resultsToProcess: z.any(),
		currentCandidates: z.array(z.object({ id: z.string() })).optional()
	}),
	outputSchema: z.object({
		processedCandidates: z.array(z.object({ id: z.string() })),
		totalFound: z.number(),
		lastBatchNewCount: z.number()
	}),
	execute: async ({ context }) => {
		// Get inputs from previous steps if they exist
		const rawResults = context.getStepResult('googleSearch')?.rawResults || {};
		const prevCandidates = context.getStepResult('processResults')?.processedCandidates || [];

		console.log('processResultsStep ', prevCandidates);

		const { newCandidates, updatedCandidateList } = await parseAndValidateResults(
			rawResults,
			prevCandidates
		);
		return {
			processedCandidates: updatedCandidateList,
			totalFound: updatedCandidateList.length,
			lastBatchNewCount: newCandidates.length
		};
	}
});

// Define a final collection step for type safety
const collectProfilesStep = new Step({
	id: 'collectAndFetchProfiles',
	inputSchema: z.object({
		candidates: z.array(z.object({ id: z.string() }))
	}),
	outputSchema: z.object({
		collectedProfiles: z.array(z.any())
	}),
	execute: async ({ context }) => {
		// Get candidates from previous step
		const candidates = context.getStepResult('processResults')?.processedCandidates || [];

		console.log('collectProfilesStep', candidates);
		const fetchPromises = candidates.map((candidate: { id: string }) => {
			return fetchProfileFromAPI(candidate.id);
		});

		const profiles = await Promise.all(fetchPromises);
		return { collectedProfiles: profiles };
	}
});

// --- Define the workflow ---

export const candidateSourcingWorkflow = new Workflow({
	name: 'candidate-sourcing-loop',
	triggerSchema: z.object({
		initialQuery: z.string()
	})
});

// Initialize the workflow with simpler chaining
candidateSourcingWorkflow
	.step(googleSearchStep)
	.then(processResultsStep)
	.while(async ({ context }) => {
		const result = context.getStepResult(processResultsStep);
		// Exit the loop if we have 100+ candidates OR if no new candidates were found in the last batch
		return (result?.totalFound ?? 0) < 100 && (result?.lastBatchNewCount ?? 0) > 0;
	}, processResultsStep)
	.then(collectProfilesStep);

// Commit the workflow definition
candidateSourcingWorkflow.commit();

export async function runWorkFlow(query: string) {
	// Create a workflow run with a unique ID
	const { runId, start } = candidateSourcingWorkflow.createRun();

	console.log(`Starting candidate search workflow: ${runId}`);

	// Start the workflow with the provided query
	const result = await start({
		triggerData: {
			initialQuery: query
		}
	});

	return result;
}
