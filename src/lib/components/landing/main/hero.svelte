<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import Container from '$lib/components/landing/container.svelte';
	import BlurText from '$lib/components/landing/blur-text.svelte';
	import { Button } from '$lib/components/ui/button';
	import Search from '$lib/components/landing/main/search.svelte';
</script>

<div class="relative z-40 mx-auto my-24 flex w-full max-w-5xl flex-col items-center text-center">
	<Container delay={0.0}>
		<div
			class="mx-auto flex w-max cursor-pointer select-none items-center gap-2.5 rounded-full border border-foreground/10 py-1 pl-2 pr-1 backdrop-blur-lg hover:border-foreground/15"
		>
			<div class="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/40">
				<div
					class="flex h-2.5 w-2.5 animate-ping items-center justify-center rounded-full bg-primary/60"
				>
					<div
						class="flex h-2.5 w-2.5 animate-ping items-center justify-center rounded-full bg-primary/60"
					></div>
				</div>
				<div
					class="absolute left-1/2 top-1/2 flex h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary"
				></div>
			</div>
			<span
				class="animate-text-gradient animate-background-shine inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-sm text-transparent"
			>
				Build for the future
				<span
					class="flex items-center justify-center rounded-full bg-gradient-to-b from-foreground/20 to-foreground/10 px-1.5 py-0.5 text-xs text-secondary-foreground"
				>
					What&apos;s new
					<ArrowRight class="ml-1 h-3.5 w-3.5 text-foreground/50" />
				</span>
			</span>
		</div>
	</Container>
	<BlurText
		word={'Find the Right Fit in Seconds'}
		className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent py-2 md:py-0 lg:!leading-snug font-medium racking-[-0.0125em] mt-6 font-heading"
	/>
	<Container delay={0.1}>
		<p class="mx-auto mt-4 max-w-2xl text-sm text-accent-foreground/60 sm:text-base lg:text-lg">
			Elevate your hiring with AI-powered sourcing and screening. <span
				class="hidden sm:inline"
				>Meen is your all-in-one talent acquisition solution.</span
			>
		</p>
	</Container>
	<Container delay={0.2}>
		<div class="mt-8 flex items-center justify-center md:gap-x-6">
			<Button asChild size="lg">
				<a href="/signin"> Get Started </a>
			</Button>
		</div>
	</Container>
	<Container delay={0.3}>
		<Search />
	</Container>
</div>
