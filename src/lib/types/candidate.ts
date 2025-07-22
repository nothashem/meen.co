export interface CandidateExperience {
	company: string;
	title: string;
	starts_at?: { year: number };
	ends_at?: { year: number };
}

export interface CandidatePersonViewed {
	link: string;
	name: string;
}

export interface CandidateData {
	// Needed for key in search results loop
	public_identifier?: string;
	profile_pic_url?: string;
	full_name?: string;
	first_name?: string;
	last_name?: string;
	headline?: string;
	// Use city/country if available, fallback to location
	location?: string;
	city?: string;
	country_full_name?: string;
	connections?: number;
	skills?: string[];
	people_also_viewed?: CandidatePersonViewed[];
	experiences?: CandidateExperience[];
}

// Structure from the search API response
export interface SearchResultItem {
	// Assuming the search result wraps the candidate data
	data: CandidateData;
}

// Structure from the page load data
export interface Candidate {
	id: string; // Used as key in candidates loop
	data: CandidateData;
}
