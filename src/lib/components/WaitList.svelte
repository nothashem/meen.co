<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils';

	let { className = '' } = $props();
	let isSubmitting = $state(false);
	let email = $state('');
	let name = $state('');
	let company = $state('');
	let companySize = $state('');
	let role = $state('');
	let isSuccess = $state(false);
	let errorMessage = $state('');

	async function submitToWaitlist() {
		isSubmitting = true;
		errorMessage = '';

		try {
			const response = await fetch('/api/waitlist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					name,
					company,
					companySize,
					role
				})
			});

			if (response.ok) {
				isSuccess = true;
				email = '';
				name = '';
				company = '';
				companySize = '';
				role = '';
			} else {
				const data = await response.json();
				errorMessage = data.message || 'Something went wrong. Please try again.';
			}
		} catch (error) {
			errorMessage = 'Failed to submit. Please try again later.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto flex max-w-md flex-col">
	{#if isSuccess}
		<div
			class="relative rounded-lg border border-green-400 bg-green-100/80 text-green-700 shadow-sm backdrop-blur-sm"
			role="alert"
		>
			<p class="font-semibold">Thanks!</p>
			<p>We'll notify you when we launch.</p>
		</div>
	{:else}
		<Dialog.Root>
			<Dialog.Trigger
				class={cn(
					className
				)}
			>
				Search
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[450px]">
				<Dialog.Header>
					<Dialog.Title class="text-2xl font-bold text-primary">Join Our Waitlist</Dialog.Title>
					<Dialog.Description class="text-foreground/70">
						Enter your details to be notified when we launch.
					</Dialog.Description>
				</Dialog.Header>

				<div class="grid gap-5 py-5">
					{#if errorMessage}
						<div
							class="relative rounded-lg border border-red-400 bg-red-100/80 px-4 py-3 text-red-700 shadow-sm"
							role="alert"
						>
							<p class="text-sm font-medium">{errorMessage}</p>
						</div>
					{/if}

					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right font-medium">Name</Label>
						<Input
							id="name"
							type="text"
							placeholder="Your name"
							bind:value={name}
							class="col-span-3 border-input/60 focus:border-primary"
						/>
					</div>

					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="email" class="text-right font-medium">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Your email"
							bind:value={email}
							class="col-span-3 border-input/60 focus:border-primary"
						/>
					</div>

					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="company" class="text-right font-medium">Company</Label>
						<Input
							id="company"
							type="text"
							placeholder="Your company (optional)"
							bind:value={company}
							class="col-span-3 border-input/60 focus:border-primary"
						/>
					</div>

					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="companySize" class="text-right font-medium">Company Size</Label>
						<Input
							id="companySize"
							type="text"
							placeholder="Company size (optional)"
							bind:value={companySize}
							class="col-span-3 border-input/60 focus:border-primary"
						/>
					</div>

					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="role" class="text-right font-medium">Role</Label>
						<Input
							id="role"
							type="text"
							placeholder="Your role (optional)"
							bind:value={role}
							class="col-span-3 border-input/60 focus:border-primary"
						/>
					</div>
				</div>

				<Dialog.Footer class="flex justify-end gap-3">
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
					<Button
						type="submit"
						onclick={submitToWaitlist}
						disabled={isSubmitting}
						class="min-w-24 bg-primary font-medium hover:bg-primary/90"
					>
						{isSubmitting ? 'Submitting...' : 'Join Waitlist'}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/if}
</div>
