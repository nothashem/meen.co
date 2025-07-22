import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { signIn } from '../../auth';

export const actions: Actions = { default: signIn };

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	return { user: null };
}
