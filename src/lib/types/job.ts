export type CreateStep = 'basic' | 'requirements' | 'review';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type JobStatus = 'open' | 'in-progress' | 'filled' | 'on-hold' | 'closed';
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';
export type Currency = 'USD' | 'EUR' | 'GBP';
export type RequirementType = 'must-have' | 'nice-to-have';

export interface Salary {
	min: number;
	max: number;
	currency: Currency;
}

export interface Requirement {
	id: string;
	type: RequirementType;
	description: string;
	weight: number;
}

export interface Job {
	id: string;
	title: string;
	department: string;
	location: string;
	type: JobType;
	status: JobStatus;
	priority: JobPriority;
	salary: Salary;
	description: string;
	responsibilities: string[];
	requirements: Requirement[];
	benefits: string[];
	tech_stack: string[];
	remote_policy: string;
}
