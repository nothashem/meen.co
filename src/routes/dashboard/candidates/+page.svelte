<script lang="ts">
	import { Search } from '@lucide/svelte';

	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import { Skeleton } from '@/components/ui/skeleton';
	import CandidateCard from '$lib/components/dashboard/CandidateCard.svelte';
	import type { Candidate, SearchResultItem } from '$lib/types/candidate';

	let { data }: { data: { candidates: Candidate[] } } = $props();

	let addUrlQuery = $state('');
	let searchQuery = $state('');
	let searchResults = $state<SearchResultItem[]>([]);
	let isSearching = $state(false);

	async function manuallyAddCandidate(query: string) {
		await fetch(`/api/candidate/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ linkedinUrl: query })
		});
		window.location.reload();
	}

	async function searchCandidates(query: string) {
		if (!query.trim()) return;

		isSearching = true;
		try {
			const response = await fetch(`/api/candidate/scan`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ query })
			});
			const data = await response.json();
			searchResults = data;
		} finally {
			isSearching = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-3xl font-bold tracking-tight">Search Candidates</h2>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<Card>
			<CardHeader>
				<CardTitle>Start a candidate scan</CardTitle>
				<CardDescription>Let an agent scan candidates for you based on your needs</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="flex space-x-2">
					<div class="relative flex-1">
						<Search
							class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							bind:value={searchQuery}
							type="search"
							placeholder="Search candidates..."
							class="pl-10"
						/>
					</div>
					<Button disabled={isSearching} onclick={() => searchCandidates(searchQuery)}>
						{isSearching ? 'Searching...' : 'Search'}
					</Button>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Manually Add Candidate</CardTitle>
				<CardDescription>Add a candidate using their LinkedIn profile URL</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="flex space-x-2">
					<div class="relative flex-1">
						<Input
							bind:value={addUrlQuery}
							type="url"
							placeholder="Enter LinkedIn URL"
							class="pl-3"
						/>
					</div>
					<Button onclick={() => manuallyAddCandidate(addUrlQuery)}>Add Candidate</Button>
				</div>
			</CardContent>
		</Card>
	</div>
	{#if searchResults.length > 0}
		<h1 class="text-2xl font-bold">Search Results</h1>
		<div class="grid gap-6">
			{#each searchResults as result (result.data.public_identifier)}
				<CandidateCard candidateData={result.data}>
					<div slot="actions" class="flex flex-col gap-2">
						<Button variant="outline" size="sm">View Profile</Button>
						<Button size="sm">Contact</Button>
					</div>
				</CandidateCard>
			{/each}
		</div>
		<h1 class="text-2xl font-bold">All Profiles</h1>
	{/if}

	<div class="grid gap-6">
		{#await data.candidates}
			{#each Array(3) as _ (index)}
				<Card>
					<CardContent class="flex items-center gap-4 p-6">
						<Skeleton class="h-16 w-16 rounded-full" />
						<div class="flex-1 space-y-2">
							<Skeleton class="h-4 w-[200px]" />
							<Skeleton class="h-4 w-[150px]" />
						</div>
						<div class="flex flex-col gap-2">
							<Skeleton class="h-8 w-[100px]" />
							<Skeleton class="h-8 w-[100px]" />
						</div>
					</CardContent>
				</Card>
			{/each}
		{:then candidates}
			{#each candidates as candidate (candidate.id)}
				<CandidateCard candidateData={candidate.data} b64={candidate.profileImageB64}>
					<div slot="actions" class="flex flex-col gap-2">
						<Button href="https://linkedin.com/in/{candidate.handle}" variant="outline" size="sm"
							>View Profile</Button
						>
						<Button size="sm">Contact</Button>
					</div>
				</CandidateCard>
			{:else}
				<div class="rounded-lg border bg-card p-8 text-center">
					<p class="text-muted-foreground">No candidates found</p>
				</div>
			{/each}
		{/await}
	</div>
</div>
