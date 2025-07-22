import { redirect } from '@sveltejs/kit';
import { count } from 'drizzle-orm';

import { db } from '@/server/db';
import { jobPost, linkedInProfile } from '@/server/db/schema';
import { candidates } from '@/server/db/schema';

import type { LayoutServerLoad } from './$types';

const cache = new Map<string, number>();
export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/signin');
	}

	const cachedCandidates = cache.get('totalCandidates');
	const cachedJobs = cache.get('totalJobs');
	const cachedPeople = cache.get('totalPeople');

	if (cachedCandidates !== undefined && cachedJobs !== undefined && cachedPeople !== undefined) {
		return {
			totalCandidates: cachedCandidates,
			totalJobs: cachedJobs,
			totalPeople: cachedPeople
		};
	}

	const [totalCandidates, totalJobs, totalPeople] = await Promise.all([
		db.select({ count: count() }).from(candidates),
		db.select({ count: count() }).from(jobPost),
		db.select({ count: count() }).from(linkedInProfile)
	]);

	cache.set('totalCandidates', totalCandidates[0].count);
	cache.set('totalJobs', totalJobs[0].count);
	cache.set('totalPeople', totalPeople[0].count);

	return {
		totalCandidates: cache.get('totalCandidates'),
		totalJobs: cache.get('totalJobs'),
		totalPeople: cache.get('totalPeople')
	};
};
