import type { PersonEndpointResponse } from 'proxycurl-js-linkedin-profile-scraper';

import type { JobData } from '@/server/job';

/**
 * Safely access nested properties of an object.
 * @param obj The object to access.
 * @param path Dot-separated path string (e.g., 'user.address.city').
 * @param defaultValue Value to return if path is not found or value is null/undefined.
 * @returns The value at the path or the default value.
 */
const safeGet = (obj: any, path: string, defaultValue: string = ''): string => {
	// Trim path to avoid issues with leading/trailing dots
	const trimmedPath = path.trim();
	if (!trimmedPath) return defaultValue;

	const value = trimmedPath
		.split('.')
		.reduce((o, k) => (o && o[k] !== undefined && o[k] !== null ? o[k] : undefined), obj);
	// Ensure the final value is treated as a string, defaulting if it's null/undefined
	return value !== undefined && value !== null ? String(value) : defaultValue;
};

/**
 * Formats an array of objects into a string of XML tags.
 * @param items Array of objects.
 * @param parentTag The XML tag name for the container element.
 * @param itemTag The XML tag name for each item element.
 * @param fields Array defining mappings from JSON keys to XML tags within each item.
 * @returns Formatted XML string section, or an empty string if no items.
 */
const formatObjectListToTags = (
	items: unknown[] | undefined,
	parentTag: string,
	itemTag: string,
	fields: { jsonKey: string; xmlTag: string }[]
): string => {
	if (!Array.isArray(items) || items.length === 0) return '';

	const itemStrings = items
		.map((item: any) => {
			const fieldTags = fields
				.map((f) => {
					const value = safeGet(item, f.jsonKey);
					// Only include the tag if the value is not empty
					return value ? `            <${f.xmlTag}>${value}</${f.xmlTag}>` : '';
				})
				.filter((tag) => tag) // Remove empty tags resulting from empty values
				.join('\n');

			// Only include the itemTag if there are non-empty fieldTags inside
			return fieldTags ? `        <${itemTag}>\n${fieldTags}\n        </${itemTag}>` : '';
		})
		.filter((itemStr) => itemStr); // Remove empty item entries

	return itemStrings.length > 0
		? `    <${parentTag}>\n${itemStrings.join('\n')}\n    </${parentTag}>`
		: '';
};

/**
 * Formats an array of simple strings or objects (extracting one key) into XML tags.
 * @param items Array of strings or objects.
 * @param parentTag The XML tag name for the container element.
 * @param itemTag The XML tag name for each item element.
 * @param jsonKey Optional key to extract if items are objects. If undefined, items are treated as strings.
 * @returns Formatted XML string section, or an empty string if no items.
 */
const formatSimpleListToTags = (
	items: unknown[] | undefined,
	parentTag: string,
	itemTag: string,
	jsonKey?: string
): string => {
	if (!Array.isArray(items) || items.length === 0) return '';

	const itemStrings = items
		.map((item: any) => {
			const value = jsonKey
				? safeGet(item, jsonKey)
				: item !== null && item !== undefined
					? String(item)
					: '';
			// Only include the tag if the value is not empty
			return value ? `        <${itemTag}>${value}</${itemTag}>` : '';
		})
		.filter((tag) => tag);

	return itemStrings.length > 0
		? `    <${parentTag}>\n${itemStrings.join('\n')}\n    </${parentTag}>`
		: '';
};

// --- Main Function for Job Posts ---

/**
 * Generates an XML-tagged string for embedding a job post object.
 * @param jobPost The job post data object.
 * @returns An XML-tagged string representing the job post.
 */
export function generateJobPostEmbeddingInput(jobPost: JobData): string {
	const formatSalaryToTags = (salary: unknown): string => {
		if (salary && typeof salary === 'object') {
			const s = salary as { min?: number; max?: number; currency?: string; period?: string };
			let tags = '';
			if (s.min) tags += `            <min_salary>${s.min}</min_salary>\n`;
			if (s.max) tags += `            <max_salary>${s.max}</max_salary>\n`;
			if (s.currency) tags += `            <currency>${s.currency}</currency>\n`;
			if (s.period) tags += `            <period>${s.period}</period>\n`;
			return tags ? `    <salary_info>\n${tags.trim()}\n    </salary_info>` : '';
		}
		return '';
	};

	const parts = [
		`<jobPost>`,
		`    <title>${safeGet(jobPost, 'title')}</title>`,
		`    <description>${safeGet(jobPost, 'description')}</description>`,
		jobPost.location ? `    <location>${safeGet(jobPost, 'location')}</location>` : '',
		jobPost.department ? `    <department>${safeGet(jobPost, 'department')}</department>` : '',
		jobPost.type ? `    <job_type>${safeGet(jobPost, 'type')}</job_type>` : '',
		jobPost.remote_policy
			? `    <remote_policy>${safeGet(jobPost, 'remote_policy')}</remote_policy>`
			: '',
		formatSimpleListToTags(
			jobPost.responsibilities as string[] | undefined,
			'responsibilities',
			'responsibility'
		),
		formatSimpleListToTags(
			jobPost.requirements as string[] | undefined,
			'requirements',
			'requirement'
		),
		formatSimpleListToTags(jobPost.tech_stack as string[] | undefined, 'tech_stack', 'tech'),
		formatSimpleListToTags(jobPost.benefits as string[] | undefined, 'benefits', 'benefit'),
		formatSalaryToTags(jobPost.salary),
		`</jobPost>`
	];

	// Filter out empty lines/tags and join
	const jobPostInputStringTagged = parts.filter((part) => part && part.trim() !== '').join('\n');

	console.log(jobPostInputStringTagged.replace(/\n\s*\n/g, '\n').trim());
	// Clean up potential double blank lines that might result from filtering
	return jobPostInputStringTagged.replace(/\n\s*\n/g, '\n').trim();
}

export function generateJobPostEmbeddingInputFull(jobPost: JobData): string {
	const formatSalaryToTags = (salary: unknown): string => {
		if (salary && typeof salary === 'object') {
			const s = salary as { min?: number; max?: number; currency?: string; period?: string };
			let tags = '';
			if (s.min) tags += `            <min_salary>${s.min}</min_salary>\n`;
			if (s.max) tags += `            <max_salary>${s.max}</max_salary>\n`;
			if (s.currency) tags += `            <currency>${s.currency}</currency>\n`;
			if (s.period) tags += `            <period>${s.period}</period>\n`;
			return tags ? `    <salary_info>\n${tags.trim()}\n    </salary_info>` : '';
		}
		return '';
	};

	const parts = [
		`<jobPost>`,
		`    <company>${safeGet(jobPost, 'company_id')}</company>`,
		`    <title>${safeGet(jobPost, 'title')}</title>`,
		`    <description>${safeGet(jobPost, 'description')}</description>`,
		jobPost.location ? `    <location>${safeGet(jobPost, 'location')}</location>` : '',
		jobPost.department ? `    <department>${safeGet(jobPost, 'department')}</department>` : '',
		jobPost.type ? `    <job_type>${safeGet(jobPost, 'type')}</job_type>` : '',
		jobPost.remote_policy
			? `    <remote_policy>${safeGet(jobPost, 'remote_policy')}</remote_policy>`
			: '',
		formatSimpleListToTags(
			jobPost.responsibilities as string[] | undefined,
			'responsibilities',
			'responsibility'
		),
		formatSimpleListToTags(
			jobPost.requirements as string[] | undefined,
			'requirements',
			'requirement'
		),
		formatSimpleListToTags(jobPost.tech_stack as string[] | undefined, 'tech_stack', 'tech'),
		formatSimpleListToTags(jobPost.benefits as string[] | undefined, 'benefits', 'benefit'),
		formatSalaryToTags(jobPost.salary),
		`</jobPost>`
	];

	// Filter out empty lines/tags and join
	const jobPostInputStringTagged = parts.filter((part) => part && part.trim() !== '').join('\n');

	console.log(jobPostInputStringTagged.replace(/\n\s*\n/g, '\n').trim());
	// Clean up potential double blank lines that might result from filtering
	return jobPostInputStringTagged.replace(/\n\s*\n/g, '\n').trim();
}

// --- Main Function for LinkedIn Profiles ---

/**
 * Generates an XML-tagged string for embedding a LinkedIn profile object.
 * Assumes the profile object has a 'data' property matching the previously provided JSON structure.
 * @param profile The LinkedIn profile data object.
 * @returns An XML-tagged string representing the LinkedIn profile.
 */
export function generateLinkedInProfileEmbeddingInput(profile: PersonEndpointResponse): string {
	const data = profile;

	if (!data) {
		return '';
	}

	// Construct location string conditionally
	const city = safeGet(data, 'city');
	const state = safeGet(data, 'state');
	const country = safeGet(data, 'country_full_name');
	const locationParts = [city, state, country].filter((part) => part); // Filter out empty parts
	const locationString =
		locationParts.length > 0 ? `<location>${locationParts.join(', ')}</location>` : '';

	const parts = [
		`<linkedInProfile>`,
		`    <name>${safeGet(data, 'full_name')}</name>`,
		`    <url>https://www.linkedin.com/in/${data.public_identifier}</url>`,
		safeGet(data, 'headline') ? `    <headline>${safeGet(data, 'headline')}</headline>` : '',
		safeGet(data, 'occupation')
			? `    <occupation>${safeGet(data, 'occupation')}</occupation>`
			: '',
		locationString ? `    ${locationString}` : '', // Add formatted location string
		safeGet(data, 'industry') ? `    <industry>${safeGet(data, 'industry')}</industry>` : '',
		safeGet(data, 'summary') ? `    <summary>${safeGet(data, 'summary')}</summary>` : '',
		formatSimpleListToTags(data.skills ?? [], 'skills', 'skill'),
		formatObjectListToTags(data.experiences, 'experiences', 'experience_entry', [
			{ jsonKey: 'title', xmlTag: 'title' },
			{ jsonKey: 'location', xmlTag: 'location' },
			{ jsonKey: 'description', xmlTag: 'description' }
		]),
		formatObjectListToTags(data.education, 'education', 'education_entry', [
			{ jsonKey: 'school', xmlTag: 'school' },
			{ jsonKey: 'degree_name', xmlTag: 'degree' },
			{ jsonKey: 'field_of_study', xmlTag: 'field_of_study' },
			{ jsonKey: 'description', xmlTag: 'description' }
		]),
		formatObjectListToTags(data.certifications, 'certifications', 'certification_entry', [
			{ jsonKey: 'name', xmlTag: 'name' },
			{ jsonKey: 'authority', xmlTag: 'authority' }
		]),
		formatObjectListToTags(data.accomplishment_projects, 'projects', 'project_entry', [
			{ jsonKey: 'title', xmlTag: 'title' },
			{ jsonKey: 'description', xmlTag: 'description' }
		]),
		formatObjectListToTags(data.accomplishment_publications, 'publications', 'publication_entry', [
			{ jsonKey: 'name', xmlTag: 'name' },
			{ jsonKey: 'publisher', xmlTag: 'publisher' },
			{ jsonKey: 'description', xmlTag: 'description' }
		]),
		formatObjectListToTags(data.accomplishment_honors_awards, 'honors_awards', 'award_entry', [
			{ jsonKey: 'title', xmlTag: 'title' },
			{ jsonKey: 'issuer', xmlTag: 'issuer' },
			{ jsonKey: 'description', xmlTag: 'description' }
		]),
		formatObjectListToTags(data.volunteer_work, 'volunteer_work', 'volunteer_entry', [
			{ jsonKey: 'title', xmlTag: 'title' },
			{ jsonKey: 'description', xmlTag: 'description' }
		]),
		formatSimpleListToTags(data.accomplishment_courses, 'courses', 'course', 'name'),
		formatSimpleListToTags(data.languages, 'languages', 'language'), // Assuming languages is array of strings
		`</linkedInProfile>`
	];

	// Filter out empty lines/tags and join
	const profileInputStringTagged = parts.filter((part) => part && part.trim() !== '').join('\n');

	// Clean up potential double blank lines
	return profileInputStringTagged.replace(/\n\s*\n/g, '\n').trim();
}
