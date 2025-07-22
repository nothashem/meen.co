<script lang="ts">
	import Input from '@/components/ui/input/input.svelte';
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/ui/button';
	let jobPostUrl = $state('');
</script>

<section
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background py-10"
>
	<div class="container z-10 flex flex-col items-center justify-center space-y-10 px-4 text-center">
		<Logo />

		<div class="relative space-y-4">
			<!-- Text glow effects -->
			<div class="absolute -inset-1 z-0 rounded-lg bg-primary/10 opacity-30 blur-xl"></div>

			<h1
				class="relative z-10 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
			>
				<span
					class="bg-gradient-to-r from-primary via-purple-400 to-indigo-400 bg-clip-text text-transparent"
				>
					Meen AI
				</span>
			</h1>
			<p class="relative z-10 mx-auto max-w-[42rem] text-xl text-foreground/90 sm:text-2xl">
				Revolutionizing the way you find and evaluate candidates.
			</p>
		</div>
	</div>

	<!-- Search section -->
	<div class="relative z-10 mt-32 w-full max-w-screen-lg px-4">
		<div
			class="overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-md dark:border-white/10 dark:bg-black/30"
		>
			<div class="p-6 md:p-10">
				<h2 class="mb-8 text-center text-2xl font-semibold text-foreground md:text-3xl">
					Find the Perfect Match
				</h2>
				<div class="relative mx-auto max-w-2xl">
					<div
						class="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-500 via-primary to-indigo-500 opacity-70 blur-sm"
					></div>
					<div
						class="relative flex overflow-hidden rounded-lg bg-card/50 backdrop-blur-sm dark:bg-black/50"
					>
						<Input
							bind:value={jobPostUrl}
							type="text"
							placeholder="Enter your job post URL"
							class="h-12 flex-1 border-none bg-transparent px-4 py-3 text-foreground placeholder-foreground/50 outline-none dark:text-white dark:placeholder-white/50"
						/>
						<Button
							href={`/signin?redirect=${page.url.pathname}/dashboard/demo/${jobPostUrl}`}
							variant="default"
							class="h-12 rounded-r-lg"
							disabled={!jobPostUrl}
						>
							Find Candidates</Button
						>
					</div>
				</div>

				<div class="mt-10 grid gap-6 sm:grid-cols-2">
					<div
						class="flex items-center rounded-lg border border-border bg-card/5 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
					>
						<div class="mr-4 h-12 w-12 overflow-hidden rounded-full">
							<img
								src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
								alt="Sarah Chen"
								class="h-full w-full object-cover"
							/>
						</div>
						<div>
							<h3 class="font-semibold text-foreground dark:text-white">Sarah Chen</h3>
							<p class="text-sm text-foreground/70 dark:text-white/70">
								Senior Product Manager at Stripe
							</p>
						</div>
					</div>

					<div
						class="flex items-center rounded-lg border border-border bg-card/5 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
					>
						<div class="mr-4 h-12 w-12 overflow-hidden rounded-full">
							<img
								src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
								alt="Michael Ross"
								class="h-full w-full object-cover"
							/>
						</div>
						<div>
							<h3 class="font-semibold text-foreground dark:text-white">Michael Ross</h3>
							<p class="text-sm text-foreground/70 dark:text-white/70">
								Product Manager at Salesforce
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Features section -->
	<div class="relative z-10 mt-32 w-full max-w-screen-lg px-4">
		<h2 class="mb-16 text-center text-4xl font-bold text-primary dark:text-purple-400 md:text-5xl">
			Our Features
		</h2>

		<div class="grid gap-8 md:grid-cols-3">
			<div
				class="overflow-hidden rounded-xl border border-border/30 bg-card/20 p-8 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 dark:border-indigo-900/30 dark:bg-black/20 dark:hover:border-purple-400/50"
			>
				<div
					class="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/30 dark:from-indigo-900/60 dark:to-purple-900/60"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-8 w-8 text-primary dark:text-purple-400"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.3-4.3"></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold text-primary dark:text-purple-400">
					AI-Powered Search
				</h3>
				<p class="text-foreground/70 dark:text-white/70">
					Natural language search that understands context and intent to find the perfect candidates
				</p>
			</div>

			<div
				class="overflow-hidden rounded-xl border border-border/30 bg-card/20 p-8 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 dark:border-indigo-900/30 dark:bg-black/20 dark:hover:border-purple-400/50"
			>
				<div
					class="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/30 dark:from-indigo-900/60 dark:to-purple-900/60"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-8 w-8 text-foreground dark:text-white"
					>
						<path d="M3 3v18h18"></path>
						<path d="M18 14v4h4"></path>
						<path d="M8 10v8"></path>
						<path d="M12 6v12"></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold text-foreground dark:text-white">Smart Ranking</h3>
				<p class="text-foreground/70 dark:text-white/70">
					Automatically rank and score candidates based on your specific requirements and criteria
				</p>
			</div>

			<div
				class="overflow-hidden rounded-xl border border-border/30 bg-card/20 p-8 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 dark:border-indigo-900/30 dark:bg-black/20 dark:hover:border-purple-400/50"
			>
				<div
					class="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/30 dark:from-indigo-900/60 dark:to-purple-900/60"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-8 w-8 text-foreground dark:text-white"
					>
						<rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
						<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
						></path>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-semibold text-foreground dark:text-white">ATS Integration</h3>
				<p class="text-foreground/70 dark:text-white/70">
					Seamlessly connect with your existing ATS to enrich candidate data and streamline workflow
				</p>
			</div>
		</div>
	</div>

	<!-- What we solve for section -->
	<div class="relative z-10 mt-32 w-full max-w-screen-lg px-4">
		<div class="mb-10 text-center">
			<h2 class="text-xl font-medium text-primary dark:text-purple-400">What we solve for</h2>
			<h3 class="mt-2 text-4xl font-bold text-foreground dark:text-white sm:text-5xl md:text-6xl">
				Efficiently identifying<br />best-fit solutions.
			</h3>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Inbound Card -->
			<div class="overflow-hidden rounded-xl bg-card/20 p-8 backdrop-blur dark:bg-black/20">
				<h3 class="mb-6 text-2xl font-semibold text-foreground dark:text-white">For Inbound</h3>
				<p class="text-lg text-foreground/70 dark:text-white/70">
					Connect your systems and immediately identify the most qualified solutions. Enrich your
					data with external sources and AI-powered insights.
				</p>
			</div>

			<!-- Outbound Card -->
			<div class="overflow-hidden rounded-xl bg-card/20 p-8 backdrop-blur dark:bg-black/20">
				<h3 class="mb-6 text-2xl font-semibold text-primary dark:text-purple-400">For Outbound</h3>
				<p class="text-lg text-foreground/70 dark:text-white/70">
					Proactively search and identify potential solutions using our advanced AI technology and
					comprehensive database.
				</p>
			</div>
		</div>
	</div>
</section>
