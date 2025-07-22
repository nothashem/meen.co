<script>
	import { cn } from '$lib/utils';
	import Container from '$lib/components/landing/container.svelte';
	import SectionBadge from '$lib/components/landing/section-badge.svelte';
	import { ChartBar, Clipboard, Search } from '@lucide/svelte';

	const PERKS = [
		{
			icon: Search,
			title: 'AI-Powered Search',
			description: 'Natural language search that understands context and intent to find the perfect candidates'
		},
		{
			icon: ChartBar,
			title: 'Smart Ranking',
			description: 'Automatically rank and score candidates based on your specific requirements and criteria'
		},
		{
			icon: Clipboard,
			title: 'ATS Integration',
			description: 'Seamlessly connect with your existing ATS to enrich candidate data and streamline workflow'
		}
	];
</script>

<div class="flex w-full flex-col items-center justify-center py-12 md:py-16 lg:py-24">
	<Container>
		<div class="mx-auto flex max-w-2xl flex-col items-center text-center">
			<SectionBadge title="Features" />
			<h2 class="font-heading mt-6 text-2xl font-medium !leading-snug md:text-4xl lg:text-5xl">
				Discover the benefits
			</h2>
			<p class="mt-6 text-center text-base text-accent-foreground/80 md:text-lg">
				Explore the powerful features and advantages that Meen offers to help you find the perfect candidates faster and streamline your talent acquisition process
			</p>
		</div>
	</Container>
	<Container>
		<div class="mt-16 w-full">
			<div class="relative grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{#each PERKS as perk, index}
					<div
						class={cn(
							'group/feature relative flex transform-gpu flex-col border-neutral-800 py-10 lg:border-r',
							(index === 0 || index === 3) && 'lg:border-l',
							index < 3 && 'lg:border-b'
						)}
					>
						{#if index < 3}
							<div
								class="from-neutral-80 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-violet-950/25 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100"
							/>
						{:else}
							<div
								class="from-neutral-80 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-violet-950/25 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100"
							/>
						{/if}
						<div
							class="flex w-full transform-gpu flex-col transition-all duration-300 group-hover/feature:-translate-y-1"
						>
							<div class="relative z-10 mb-4 px-10">
								<svelte:component
									this={perk.icon}
									strokeWidth={1.3}
									class="h-10 w-10 origin-left transform-gpu text-neutral-500 transition-all duration-300 ease-in-out group-hover/feature:scale-75 group-hover/feature:text-foreground"
								/>
							</div>
							<div class="font-heading relative z-10 mb-2 px-10 text-lg font-medium">
								<div
									class="absolute -inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-700 transition-all duration-500 group-hover/feature:h-8 group-hover/feature:bg-violet-600"
								/>
								<span
									class="group-hover/feature:-translate-y- group-hover/feature:text- heading inline-block transition duration-500"
								>
									{perk.title}
								</span>
							</div>
							<p class="relative z-10 max-w-xs px-10 text-sm text-neutral-300">
								{perk.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Container>
</div>
