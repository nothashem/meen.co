import { Resend } from 'resend';

import { RESEND_API_KEY } from '$env/static/private';

import { db, waitlist } from '../db/schema';

const resend = new Resend(RESEND_API_KEY);

async function notifyAndSaveWaitlist(
	email: string,
	name: string,
	company: string,
	companySize: string,
	role: string
) {
	await resend.emails.send({
		from: 'Meen <onboarding@meen.co>',
		to: ['lead-aaaap5b2bjt2ebl5vwhwgfuwne@meenai.slack.com'],
		subject: 'Meen - Waitlist',
		html: `<p>New waitlist signup:</p>
		<p>Email: ${email}</p>
		<p>Name: ${name}</p>
		<p>Company: ${company}</p>
		<p>Company Size: ${companySize}</p>
		<p>Role: ${role}</p>`
	});

	await db.insert(waitlist).values({ email, name, company, companySize, role }).onConflictDoUpdate({
		target: waitlist.email,
		set: { name, company, companySize, role }
	});
}
export async function waitListEmail(
	email: string,
	name?: string,
	company?: string,
	companySize?: string,
	role?: string
) {
	const { data } = await resend.emails.send({
		from: 'Meen <onboarding@meen.co>',
		to: [email],
		subject: 'Meen - Waitlist',
		html: `<p>Welcome to the Meen waitlist! We'll notify you when we launch.</p>`
	});

	notifyAndSaveWaitlist(
		email,
		name || email.split('@')[0],
		company || 'No Company Entered',
		companySize || 'No Company Size Entered',
		role || 'No Role Entered'
	);
	return data;
}
