<script lang="ts">
	import '../app.css';

	import { Heart } from 'lucide-svelte';

	import { page } from '$app/state';
	import Topbar from '$lib/components/Topbar.svelte';
	let { data, children } = $props();

	import { ModeWatcher } from 'mode-watcher';

	let email = $state('');
	let isSubmitting = $state(false);

	async function submitToWaitlist() {
		isSubmitting = true;

		try {
			const response = await fetch('/waitlist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email
				})
			});

			if (response.ok) {
				email = '';
			} else {
				console.error(await response.json());
			}
		} catch (error) {
			console.error(error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			submitToWaitlist();
		}
	}
</script>

<ModeWatcher />

<div class="min-h-screen bg-background">
	{#if !page.url.pathname.startsWith('/dashboard')}
		<Topbar user={data.user} />
	{/if}
	{@render children?.()}
	{#if page.url.pathname === '/'}
		<div
			class="absolute inset-0 mt-[-2px] h-full bg-[linear-gradient(to_right,rgba(23,23,23,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,0.4)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
		></div>
	{/if}
</div>

{#if !page.url.pathname.startsWith('/dashboard')}
	<footer
		class="w-full border-t border-border bg-card/40 pb-8 backdrop-blur-sm dark:border-white/10 dark:bg-black/40"
	>
		<div class="mx-auto max-w-screen-lg px-4">
			<div class="grid grid-cols-1 gap-8 pt-8 md:grid-cols-4">
				<div class="md:col-span-1">
					<div class="flex items-center space-x-2">
						<div class="relative">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
								<span class="text-lg font-bold text-primary-foreground">M</span>
							</div>
						</div>
						<span
							class="bg-gradient-to-r from-primary via-purple-400 to-indigo-400 bg-clip-text font-bold text-transparent"
							>Meen AI</span
						>
					</div>
					<p class="mt-2 text-sm text-foreground/70 dark:text-white/70">
						Empowering the future through intelligent solutions.
					</p>

					<div class="mt-4 flex items-center space-x-3">
						<a
							href="https://discord.gg/hA8fuAnNKh"
							target="_blank"
							aria-label="Discord"
							class="text-foreground/60 transition-colors hover:text-primary dark:text-white/60 dark:hover:text-primary"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-discord"
								viewBox="0 0 16 16"
							>
								<path
									d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
								/>
							</svg>
						</a>
					</div>
				</div>

				<div>
					<h4 class="mb-3 font-medium text-foreground dark:text-white">Company</h4>
					<ul class="space-y-2 text-sm">
						<li>
							<a
								href="mailto:hello@meen.ai"
								class="text-foreground/70 transition-colors hover:text-primary dark:text-white/70 dark:hover:text-primary"
								>Contact us</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="mb-3 font-medium text-foreground dark:text-white">Resources</h4>
					<ul class="space-y-2 text-sm">
						<li>
							<a
								href="/privacy"
								class="text-foreground/70 transition-colors hover:text-primary dark:text-white/70 dark:hover:text-primary"
								>Privacy policy</a
							>
						</li>
						<li>
							<a
								href="/terms"
								class="text-foreground/70 transition-colors hover:text-primary dark:text-white/70 dark:hover:text-primary"
								>Terms of service</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="mb-3 font-medium text-foreground dark:text-white">Get in touch</h4>
					<form class="flex flex-col space-y-2">
						<input
							bind:value={email}
							onkeydown={handleKeydown}
							type="email"
							placeholder="Enter your email"
							class="rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10"
						/>
						<button
							disabled={isSubmitting}
							onclick={submitToWaitlist}
							class="rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							{isSubmitting ? 'Submitting...' : 'Join waitlist'}
						</button>
					</form>
				</div>
			</div>

			<div
				class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-foreground/70 dark:border-white/10 dark:text-white/70 md:flex-row"
			>
				<div>
					&copy; {new Date().getFullYear()} Meen AI. All rights reserved.
				</div>
				<div class="flex items-center">
					<span>Made with</span>
					<Heart size={14} class="mx-1 text-destructive" />
					<span>by the Meen AI team</span>
				</div>
			</div>
		</div>
	</footer>
{/if}
