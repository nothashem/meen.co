
<script lang="ts">
	import Container from '$lib/components/landing/container.svelte';
	import SectionBadge from '$lib/components/landing/section-badge.svelte';
	import WaitList from '$lib/components/WaitList.svelte';

	const candidates = [
		{
			name: "Sarah Chen",
			position: "Senior Product Manager at Stripe",
			image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
			match: 98
		},
		{
			name: "Michael Ross",
			position: "Product Manager at Salesforce",
			image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
			match: 95
		},
		{
			name: "Emily Johnson",
			position: "Senior Product Manager at Dropbox",
			image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop",
			match: 92
		},
		{
			name: "David Kim",
			position: "Senior PM at Airbnb",
			image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
			match: 89
		},
		{
			name: "Sophia Martinez",
			position: "Product Manager at Adobe",
			image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
			match: 85
		},
		{
			name: "James Wilson",
			position: "Product Director at Slack",
			image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop",
			match: 82
		}
	];
</script>

<div class="relative z-10 mt-32 w-full max-w-screen-lg px-4">
	<Container delay={0.1} customClass="mb-10">
		<div class="mx-auto flex max-w-2xl flex-col items-center text-center">
			<SectionBadge title="Find the Perfect Match" />
			<h2 class="font-heading mt-6 text-2xl font-medium !leading-snug md:text-4xl lg:text-5xl">
				AI-Powered Talent Search
			</h2>
			<p class="mt-6 text-center text-base text-accent-foreground/80 md:text-lg">
				Find ideal candidates in seconds with our intelligent matching algorithm that understands your 
				specific requirements and identifies the most qualified talent for your team
			</p>
		</div>
	</Container>
	<div class="overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-md dark:border-white/10 dark:bg-black/30">
		<div class="p-6 md:p-10">
			<div class="relative mx-auto max-w-2xl">
				<div
					class="relative flex overflow-hidden rounded-lg bg-card/50 backdrop-blur-sm dark:bg-black/50"
				>
					<div class="flex-1 flex items-center">
						<svg class="h-5 w-5 ml-4 text-foreground/50 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
						<input
							type="text"
							placeholder="Senior Product Manager with 5+ years SaaS exp"
							class="w-full flex-1 border-none bg-transparent px-4 py-3.5 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-white/50"
						/>
					</div>
					<WaitList className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3.5 transition-colors"/>

				</div>
				<div class="mt-2 flex flex-wrap gap-2">
					<span class="text-xs bg-primary/20 text-primary font-medium px-2 py-1 rounded-full">Product</span>
					<span class="text-xs bg-primary/20 text-primary font-medium px-2 py-1 rounded-full">SaaS</span>
					<span class="text-xs bg-primary/20 text-primary font-medium px-2 py-1 rounded-full">5+ years</span>
					<span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Remote</span>
				</div>
			</div>

			<div class="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
				{#each candidates as candidate, index}
					<div
						class="group/feature relative flex transform-gpu flex-col rounded-lg border border-border bg-card/10 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5 cursor-pointer"
					>
						<div
							class="from-neutral-80 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-violet-950/25 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100"
						/>
						<div class="flex items-center relative z-10 transform-gpu transition-all duration-300 group-hover/feature:-translate-y-1">
							<div class="mr-4 h-12 w-12 overflow-hidden rounded-full">
								<img
									src={candidate.image}
									alt={candidate.name}
									class="h-full w-full object-cover"
								/>
							</div>
							<div>
								<h3 class="font-semibold text-foreground dark:text-white">{candidate.name}</h3>
								<p class="text-sm text-foreground/70 dark:text-white/70">
									{candidate.position}
								</p>
								<div class="mt-1 flex items-center">
									<span class={`text-xs px-1.5 py-0.5 rounded ${candidate.match >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}>
										{candidate.match}% match
									</span>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			
			<div class="mt-6 flex justify-center">
				<button class="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 transition-colors">
					View more results
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
