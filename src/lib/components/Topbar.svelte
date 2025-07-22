<script lang="ts">
	import { Github, Linkedin, Twitter } from 'lucide-svelte';

	import { Button } from '@/components/ui/button';
	import { page } from '$app/state';

	import Logo from './Logo.svelte';
	import UserMenu from './UserMenu.svelte';
	let { user } = $props();

	let scrollY = $state(0);

	$effect(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const showTopbar = $derived(scrollY > 100 || user?.email);
</script>

<header
	class="sticky top-0 z-50 flex w-full justify-center py-4 backdrop-blur-lg transition-all duration-300"
	class:opacity-0={!showTopbar}
	class:opacity-100={showTopbar}
>
	<div
		class="flex flex w-[95%] max-w-5xl flex-row items-center justify-between rounded-full border border-border bg-background/80 px-4 py-2 shadow-lg supports-[backdrop-filter]:bg-background/60 dark:border-white/10 dark:bg-black/60"
	>
		<div class="flex items-center space-x-2">
			<Logo />
			<span
				class="hidden bg-gradient-to-r from-primary via-purple-400 to-indigo-400 bg-clip-text font-bold text-transparent sm:inline-block"
				>Meen AI</span
			>
		</div>
		<nav class="hidden items-center md:flex"></nav>

		<div class="flex items-center space-x-1 md:space-x-4">
			<div class="flex items-center space-x-2">
				{#if user}
					<a
						href="/dashboard"
						class="px-3 py-2 text-sm font-medium {page.url.pathname.startsWith('/dashboard')
							? 'text-primary'
							: 'text-foreground/70'} transition-colors hover:text-primary dark:hover:text-primary"
					>
						Dashboard
					</a>
				{:else}
					<Button
						variant="default"
						href="/signin"
						class="rounded-full bg-primary text-sm text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
					>
						Get Started
					</Button>
				{/if}
			</div>

			<UserMenu {user} />
		</div>
	</div>
</header>

<style>
	/* Add responsive styles for smaller screens if needed */
	@media (max-width: 768px) {
		nav {
			display: none;
		}
	}
</style>
