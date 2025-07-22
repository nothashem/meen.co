import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

const embeddingModel = openai.embedding('text-embedding-3-large', {
	dimensions: 1536 // for the index to work correctly
});

export const o3Mini = openai('o3-mini');
export const gpt4o = openai('gpt-4o');
export const o3 = openai('o3-2025-04-16');
export const o4mini = openai('o4-mini');
export const gemini2dot5pro = google('gemini-2.5-pro-preview-03-25');

export const gpt4omini = openai('gpt-4o-mini');
export const claude37Sonnet = anthropic('claude-3-7-sonnet-20250219');
export const claude35Sonnet = anthropic('claude-3-5-sonnet-20240620');
export async function embedText(text: string) {
	const content = text.replace(/\n/g, ' ');
	const embedding = await embeddingModel.doEmbed({ values: [content] });
	return embedding.embeddings[0];
}
