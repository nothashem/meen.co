<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from '$lib/components/ui/breadcrumb';

	let { data, children } = $props();

	// Initialize isCollapsed from cookie or default to false
	let initialCollapsed = false;
	if (browser) {
		const cookieValue = document.cookie
			.split('; ')
			.find((row) => row.startsWith('PaneForge:collapsed='))
			?.split('=')[1];
		initialCollapsed = cookieValue === 'true';
	}
	let isCollapsed = $state(initialCollapsed);

	// Function to update the cookie when isCollapsed changes
	$effect(() => {
		if (browser) {
			document.cookie = `PaneForge:collapsed=${isCollapsed}; path=/; max-age=31536000; SameSite=Strict`;
		}
	});

	// Generate breadcrumb items based on the current route
	function getBreadcrumbs() {
		const path = $page.url.pathname;
		const segments = path.split('/').filter(Boolean);

		const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard', active: segments.length === 1 }];
		let currentPath = '/dashboard';
		for (let i = 1; i < segments.length; i++) {
			currentPath += `/${segments[i]}`;
			const isLast = i === segments.length - 1;
			breadcrumbs.push({
				label: segments[i].charAt(0).toUpperCase() + segments[i].slice(1).replace(/-/g, ' '),
				href: currentPath,
				active: isLast
			});
		}

		return breadcrumbs;
	}
</script>

<div class="flex min-h-screen w-full bg-background">
	<Sidebar user={data.user} bind:isCollapsed />
	<div
		class="flex-1 transition-all duration-300"
		style:margin-left={isCollapsed ? '80px' : '256px'}
	>
		<main class="flex-1 p-6">
			<div class="mb-6 flex items-center space-x-1 px-1 py-3">
				<Breadcrumb>
					<BreadcrumbList class="flex items-center space-x-1 text-sm font-medium">
						{#each getBreadcrumbs() as crumb, i (crumb.href)}
							<BreadcrumbItem class="flex items-center">
								{#if crumb.active}
									<BreadcrumbPage class="font-semibold text-foreground/70"
										>{crumb.label}</BreadcrumbPage
									>
								{:else}
									<BreadcrumbLink
										href={crumb.href}
										class="text-muted-foreground transition-colors hover:text-primary"
										>{crumb.label}</BreadcrumbLink
									>
								{/if}
							</BreadcrumbItem>
							{#if i < getBreadcrumbs().length - 1}
								<BreadcrumbSeparator class="text-muted-foreground/50" />
							{/if}
						{/each}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			{@render children?.()}
		</main>
	</div>
</div>
