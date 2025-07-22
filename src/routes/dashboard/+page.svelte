<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { fade, fly, scale, slide } from 'svelte/transition';

	let { data } = $props();
	import Container from '$lib/components/landing/container.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
</script>

<div class="container mx-auto flex flex-col gap-8 py-8" in:fade={{ duration: 300, delay: 150 }}>
	<div class="flex items-center justify-between" in:slide={{ duration: 400, delay: 200 }}>
		<h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<!-- Analytics Cards -->
		<div in:fly={{ y: 20, duration: 400, delay: 250 }}>
			<Card
				class="overflow-hidden border-transparent bg-gradient-to-br from-card/80 to-card shadow-sm transition-all hover:shadow-md dark:border-border/30 dark:from-card/40 dark:to-card/60 dark:shadow-md"
			>
				<div class="relative flex h-full flex-col justify-between p-6">
					<div class="z-10 flex flex-col gap-2">
						<h3 class="text-lg font-semibold text-foreground/80">Active Job Posts</h3>
						<p class="text-4xl font-bold text-primary">{data.totalJobs}</p>
						<p class="flex items-center text-xs font-medium text-green-600">
							<span class="mr-1 inline-block">↑</span> 8% from last month
						</p>
					</div>
				</div>
			</Card>
		</div>

		<div in:fly={{ y: 20, duration: 400, delay: 350 }}>
			<Card
				class="overflow-hidden border-transparent bg-gradient-to-br from-card/80 to-card shadow-sm transition-all hover:shadow-md dark:border-border/30 dark:from-card/40 dark:to-card/60 dark:shadow-md"
			>
				<div class="relative flex h-full flex-col justify-between p-6">
					<div class="z-10 flex flex-col gap-2">
						<h3 class="text-lg font-semibold text-foreground/80">Candidate Matches</h3>
						<p class="text-4xl font-bold text-indigo-400">{data.totalCandidates}</p>
						<p class="flex items-center text-xs font-medium text-green-600">
							<span class="mr-1 inline-block">↑</span> 12% from last month
						</p>
					</div>
				</div>
			</Card>
		</div>

		<div in:fly={{ y: 20, duration: 400, delay: 450 }}>
			<Card
				class="overflow-hidden border-transparent bg-gradient-to-br from-card/80 to-card shadow-sm transition-all hover:shadow-md dark:border-border/30 dark:from-card/40 dark:to-card/60 dark:shadow-md"
			>
				<div class="relative flex h-full flex-col justify-between p-6">
					<div class="z-10 flex flex-col gap-2">
						<h3 class="text-lg font-semibold text-foreground/80">Total People</h3>
						<p class="text-4xl font-bold text-purple-400">{data.totalPeople}</p>
						<p class="flex items-center text-xs font-medium text-green-600">
							<span class="mr-1 inline-block">↑</span> 5% from last month
						</p>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<!-- Main Actions Section -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Create Job Post Card -->
		<div in:scale={{ start: 0.95, duration: 400, delay: 550, easing: quintOut }}>
			<Card
				class="group overflow-hidden border-transparent bg-gradient-to-br from-card/80 to-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border/30 dark:from-card/40 dark:to-card/60 dark:shadow-md"
			>
				<div class="relative flex h-full flex-col justify-between p-8">
					<div
						class="absolute inset-0 bg-gradient-to-br from-primary/5 to-indigo-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
					<div class="z-10 flex flex-col gap-4">
						<h3 class="text-2xl font-semibold text-primary">Create Job Post</h3>
						<p class="text-base leading-relaxed text-muted-foreground">
							Create a new job post with AI-powered matching to find the perfect candidates for your
							specific requirements
						</p>
					</div>
					<div class="z-10 mt-6">
						<a
							href="/dashboard/jobs"
							class="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:translate-y-[-2px] hover:bg-primary/90 hover:shadow-lg"
						>
							Get Started
						</a>
					</div>
				</div>
			</Card>
		</div>

		<!-- Search Candidates Card -->
		<div in:scale={{ start: 0.95, duration: 400, delay: 650, easing: quintOut }}>
			<Card
				class="group overflow-hidden border-transparent bg-gradient-to-br from-card/80 to-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border/30 dark:from-card/40 dark:to-card/60 dark:shadow-md"
			>
				<div class="relative flex h-full flex-col justify-between p-8">
					<div
						class="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
					<div class="z-10 flex flex-col gap-4">
						<h3 class="text-2xl font-semibold text-indigo-400">Search Candidates</h3>
						<p class="text-base leading-relaxed text-muted-foreground">
							Use our AI-powered search to find and manage potential candidates that match your
							specific requirements
						</p>
					</div>
					<div class="z-10 mt-6">
						<a
							href="/dashboard/candidates"
							class="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:translate-y-[-2px] hover:bg-primary/90 hover:shadow-lg"
						>
							Search Now
						</a>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<!-- Recent Activity Section -->
	<div class="mt-4">
		<h2 class="mb-6 text-2xl font-semibold" in:slide={{ duration: 300, delay: 750 }}>
			Recent Activity
		</h2>
		<div class="grid grid-cols-1 gap-4">
			<div in:fly={{ x: -20, duration: 400, delay: 850 }}>
				<Card
					class="group overflow-hidden border-transparent bg-gradient-to-br from-card/80 to-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border/30 dark:from-card/40 dark:to-card/60 dark:shadow-md"
				>
					<div class="flex items-center p-5">
						<div class="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
							<span class="text-sm font-medium text-white">JS</span>
						</div>
						<div>
							<p class="text-base font-medium text-foreground">
								New candidate match: <span class="font-semibold text-primary">John Smith</span>
							</p>
							<p class="mt-1 text-sm text-muted-foreground">
								98% match for Senior Developer position
							</p>
						</div>
					</div>
				</Card>
			</div>

			<div in:fly={{ x: -20, duration: 400, delay: 950 }}>
				<Card
					class="group overflow-hidden border-transparent bg-gradient-to-br from-card/80 to-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-border/30 dark:from-card/40 dark:to-card/60 dark:shadow-md"
				>
					<div class="flex items-center p-5">
						<div class="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-400">
							<span class="text-sm font-medium text-white">JP</span>
						</div>
						<div>
							<p class="text-base font-medium text-foreground">
								Job post created: <span class="font-semibold text-indigo-400">Product Manager</span>
							</p>
							<p class="mt-1 text-sm text-muted-foreground">
								Created 2 hours ago • 15 matches found
							</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	</div>
</div>
