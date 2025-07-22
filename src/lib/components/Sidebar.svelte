<script lang="ts">
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import UserMenu from '$lib/components/UserMenu.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { User } from 'lucide-svelte';

	import {
		BriefcaseBusiness,
		Search,
		Settings,
		ChevronLeft,
		ChevronRight,
		LayoutDashboard
	} from 'lucide-svelte';

	let { isCollapsed = false, user } = $props();

	const routes = [
		{
			href: '/dashboard',
			icon: LayoutDashboard,
			title: 'Dashboard',
			label: 'Home'
		},
		{
			href: '/dashboard/jobs',
			icon: BriefcaseBusiness,
			title: 'Jobs'
		},
		{
			href: '/dashboard/candidates',
			icon: Search,
			title: 'Candidates'
		},
		{
			href: '/dashboard/settings',
			icon: Settings,
			title: 'Settings'
		}
	];

	function toggleSidebar() {
		isCollapsed = !isCollapsed;
		document.cookie = `PaneForge:collapsed=${isCollapsed}; path=/; max-age=31536000; SameSite=Strict`;
	}
</script>

<aside class="fixed inset-y-0 left-0 z-40 hidden transition-all duration-200 md:block">
	<div
		data-collapsed={isCollapsed}
		class="relative flex h-full flex-col gap-2 border-r border-border bg-gradient-to-b from-background via-background to-background/95 shadow-md transition-all duration-300"
		class:w-[240px]={!isCollapsed}
		class:w-[80px]={isCollapsed}
	>
		<!-- Logo and Header -->
		<div class="flex h-16 items-center justify-between border-b border-border px-4">
			<div class="flex items-center gap-2">
				<Logo className={isCollapsed ? 'transition-all duration-200 ml-2' : ''} />
				{#if !isCollapsed}
					<span class="ml-1 text-lg font-semibold text-foreground">Meen</span>
				{/if}
			</div>
		</div>

		<!-- Navigation -->
		<nav class="flex flex-1 flex-col gap-2 p-4">
			{#each routes as route}
				<a
					href={route.href}
					class={cn(
						'flex h-10 items-center gap-3 rounded-md px-3 transition-colors',
						$page.url.pathname === route.href
							? 'bg-primary text-primary-foreground'
							: 'text-muted-foreground hover:bg-muted hover:text-foreground'
					)}
				>
					<svelte:component this={route.icon} class="h-5 w-5" />
					{#if !isCollapsed}
						<span>{route.title}</span>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- User Menu -->
		<div class="border-t border-border p-4">
			<UserMenu {user} {isCollapsed} />
		</div>

		<!-- Tongue-style Collapse Button -->
		<button
			type="button"
			class="absolute -right-4 top-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-md transition-all hover:bg-muted"
			onclick={toggleSidebar}
			aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
		>
			{#if isCollapsed}
				<ChevronRight class="h-4 w-4" />
			{:else}
				<ChevronLeft class="h-4 w-4" />
			{/if}
		</button>
	</div>
</aside>
