import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import LinkedIn from '@auth/sveltekit/providers/linkedin';

import { AUTH_TRUST_HOST } from '$env/static/private';
import { accounts, db, sessions, users, verificationTokens } from '$lib/server/db/schema';
export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens
	}),
	providers: [
		LinkedIn // Revert to default LinkedIn provider without explicit scope override
	],
	trustHost: AUTH_TRUST_HOST === 'true'
});
