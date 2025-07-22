<script lang="ts">
	import { Briefcase, PlusCircle } from 'lucide-svelte';

	import { goto } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Card } from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { data } = $props();

	let jobIsCreating = $state(false);
	let jobURL = $state('');
	let dialogOpen = $state(false);
	
	function createJob() {
		return goto('/dashboard/jobs/create');
	}

	async function createJobByURL() {
		jobIsCreating = true;
		await fetch('/api/jobs/create/url', {
			method: 'POST',
			body: JSON.stringify({
				url: jobURL
			})
		});
		
		jobIsCreating = false;
		dialogOpen = false;
	}
</script>

<div class="container mx-auto flex flex-col gap-6 py-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold tracking-tight">All Jobs</h1>
		<div class="flex items-center gap-2">
			<Dialog.Root bind:open={dialogOpen}>
				<Dialog.Trigger>
					<Button >
						<PlusCircle class="mr-2 h-4 w-4" />
						Add existing job
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Title>Create Job</Dialog.Title>
					<Dialog.Description
						>Please enter the URL of the job you want to create.</Dialog.Description
					>
					<Dialog.Footer>
						<Input
							type="url"
							placeholder="https://www.linkedin.com/jobs/view/3724600000"
							bind:value={jobURL}
						/>
						<Button disabled={jobIsCreating} onclick={createJobByURL}>
							{jobIsCreating ? 'Creating...' : 'Create Job'}
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			<Button   onclick={createJob}>
				<PlusCircle class="mr-2 h-4 w-4" />
				Create Job
			</Button>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#await data.streamed.jobs}
			<div class="col-span-full flex items-center justify-center p-12">
				<div class="text-center">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
					></div>
					<p class="mt-2 text-sm text-muted-foreground">Loading jobs...</p>
				</div>
			</div>
		{:then jobs}
			{#if jobs.length > 0}
				{#each jobs as job (job.id)}
					<Card class="transition-all hover:shadow-md dark:border-border dark:bg-card">
						<a href={`/dashboard/jobs/${job.id}`} class="flex h-full flex-col justify-between p-6">
							<div class="flex flex-col gap-3">
								<div class="flex items-center gap-2">
									<Briefcase class="h-5 w-5 text-primary" />
									<h2 class="text-xl font-semibold">
										{#if job.title.length > 20}
											{job.title.slice(0, 20)}...
										{:else}
											{job.title}
										{/if}
									</h2>
								</div>
								<p class="text-sm text-muted-foreground">
									{#if job.description.length > 100}
										{job.description.slice(0, 100)}...
									{:else}
										{job.description}
									{/if}
								</p>
							</div>
							<div class="mt-4 flex items-center justify-between text-xs text-muted-foreground">
								<span>Created {new Date().toLocaleDateString()}</span>
								<span class="flex items-center gap-1">
									<div class="h-2 w-2 rounded-full bg-green-500"></div>
									Active
								</span>
							</div>
						</a>
					</Card>
				{/each}
			{:else}
				<div
					class="col-span-full flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-12 text-center"
				>
					<Briefcase class="h-12 w-12 text-muted-foreground" />
					<h3 class="text-lg font-medium">No jobs yet</h3>
					<p class="text-sm text-muted-foreground">Create your first job to attract candidates.</p>

					<Button class={buttonVariants({ variant: 'outline' })} onclick={createJob}>
						<PlusCircle class="mr-2 h-4 w-4 text-foreground" />
						<span class="text-foreground">Create your first job</span>
					</Button>
				</div>
			{/if}
		{/await}
	</div>
</div>
