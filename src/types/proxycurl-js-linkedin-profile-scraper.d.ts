declare module 'proxycurl-js-linkedin-profile-scraper' {
	// Define interfaces based on the provided sample response structure
	// Note: Some date types are inferred as string arrays based on the sample, adjust if needed.
	interface DateObject {
		day: number;
		month: number;
		year: number;
	}

	interface Experience {
		starts_at?: DateObject;
		ends_at?: DateObject;
		company: string;
		company_linkedin_profile_url?: string | null;
		title: string;
		description?: string | null;
		location?: string | null;
		logo_url?: string | null;
	}

	interface Education {
		starts_at?: DateObject;
		ends_at?: DateObject;
		field_of_study?: string | null;
		degree_name?: string | null;
		school: string;
		school_linkedin_profile_url?: string | null;
		description?: string | null;
		logo_url?: string | null;
	}

	interface HonourAward {
		title: string;
		issuer?: string | null;
		issued_on?: DateObject;
		description?: string | null;
	}

	interface Course {
		name: string;
		number?: string | null;
	}

	interface Project {
		starts_at?: DateObject;
		ends_at?: DateObject;
		title: string;
		description?: string | null;
		url?: string | null;
	}

	interface PeopleAlsoViewed {
		link: string;
		name: string;
		summary?: string | null;
		location?: string | null;
	}

	interface PersonEndpointResponseInferredSalary {
		min?: number | null;
		max?: number | null;
	}

	interface PersonEndpointResponseExtra {
		github_profile_id?: string | null;
		facebook_profile_id?: string | null;
		twitter_profile_id?: string | null;
	}

	export interface PersonEndpointResponse {
		public_identifier: string;
		profile_pic_url?: string | null;
		background_cover_image_url?: string | null;
		first_name: string;
		last_name: string;
		full_name: string;
		occupation?: string | null;
		headline?: string | null;
		summary?: string | null;
		country: string;
		country_full_name: string;
		city?: string | null;
		state?: string | null;
		experiences: Experience[];
		education: Education[];
		languages: string[]; // Assuming string[], adjust if needed
		accomplishment_organisations: unknown[]; // Replaced any[] with unknown[]
		accomplishment_publications: unknown[]; // Replaced any[] with unknown[]
		accomplishment_honors_awards: HonourAward[];
		accomplishment_patents: unknown[]; // Replaced any[] with unknown[]
		accomplishment_courses: Course[];
		accomplishment_projects: Project[];
		accomplishment_test_scores: unknown[]; // Replaced any[] with unknown[]
		volunteer_work: unknown[]; // Replaced any[] with unknown[]
		certifications: unknown[]; // Replaced any[] with unknown[]
		connections?: number | null;
		people_also_viewed: PeopleAlsoViewed[];
		recommendations: unknown[]; // Replaced any[] with unknown[]
		activities: unknown[]; // Replaced any[] with unknown[]
		similarly_named_profiles: unknown[]; // Replaced any[] with unknown[]
		articles: unknown[]; // Replaced any[] with unknown[]
		groups: unknown[]; // Replaced any[] with unknown[]
		skills?: string[] | null;
		inferred_salary?: PersonEndpointResponseInferredSalary | null;
		gender?: string | null;
		birth_date?: DateObject;
		industry?: string | null;
		interests: string[]; // Assuming string[], adjust if needed
		extra?: PersonEndpointResponseExtra | null;
		personal_emails: string[];
		personal_numbers: string[];
	}

	// Define the structure of the API client and methods used
	namespace ProxycurlApi {
		class ApiClient {
			static instance: ApiClient;
			authentications: {
				BearerAuth: {
					accessToken: string;
				};
			};
		}

		interface PersonProfileEndpointOptions {
			useCache?: string | 'if-cache-present' | 'if-present'; // Add other potential values if known
			skills?: string | 'include';
			inferredSalary?: string | 'include';
			personalEmail?: string | 'include';
			personalContactNumber?: string | 'include';
			twitterProfileId?: string | 'include';
			facebookProfileId?: string | 'include';
			githubProfileId?: string | 'include';
			extra?: string | 'include';
		}

		class PeopleAPIApi {
			personProfileEndpoint(
				url: string,
				fallbackToCache: string | 'on-error', // Add other potential values if known
				opts: PersonProfileEndpointOptions,
				callback: (
					error: Error | null,
					data: PersonEndpointResponse | null,
					response: unknown
				) => void // Replaced any with Error | null and unknown
			): void;
		}
	}

	export default ProxycurlApi;
}
