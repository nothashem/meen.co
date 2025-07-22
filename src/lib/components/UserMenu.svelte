<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { DropdownMenu } from 'bits-ui';
	import { LogOut, Settings, User } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';

	import { Button } from '@/components/ui/button';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	let { user, isCollapsed } = $props();
</script>

{#if user?.email}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#if page.url.pathname.startsWith('/dashboard')}
				<div class="flex items-center gap-3 transition-all duration-200 hover:bg-foreground/5">
					<Button
						variant="ghost"
						size="icon"
						class="avatar-button transition-all duration-200 hover:bg-foreground/5"
					>
						<div class="avatar">
							{#if user?.image}
								<img
									src={user.image}
									alt={user.name || 'User'}
									class="h-full w-full rounded-full object-cover"
								/>
							{:else}
								<User class="avatar-icon" strokeWidth={1.5} />
							{/if}
						</div>
					</Button>
					{#if !isCollapsed && user}
						<div class="flex flex-col overflow-hidden">
							<span class="truncate text-sm font-medium text-foreground">{user.name || 'User'}</span
							>
							<span class="truncate text-[11px] text-muted-foreground">{user.email || ''}</span>
						</div>
					{/if}
				</div>
			{:else}
				<Button
					variant="ghost"
					size="icon"
					class="avatar-button transition-all duration-200 hover:bg-foreground/5"
				>
					<div class="avatar">
						<User class="avatar-icon" strokeWidth={1.5} />
					</div>
				</Button>
			{/if}
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="dropdown-content" sideOffset={8}>
			<div class="px-3 py-2">
				<p class="text-base font-medium text-foreground dark:text-white">My Profile</p>
			</div>
			<DropdownMenu.Separator class="separator" />
			<!-- <div class="px-3 py-2">
				<p class="truncate text-sm text-muted-foreground dark:text-neutral-400">
					{user?.email || 'No email'}
				</p>
			</div>
			<DropdownMenu.Separator class="separator" /> -->
			<DropdownMenu.Item onclick={() => goto('/dashboard/settings')} class="menu-item">
				<Settings class="mr-2 h-4 w-4" />
				<span>Settings</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => toggleMode()} class="menu-item">
				<div class="mr-2 flex h-4 w-4 items-center justify-center">
					<Sun class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon
						class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
				</div>
				<span>Toggle theme</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator class="separator" />
			<DropdownMenu.Item
				onclick={() => signOut({ redirectTo: page.url.pathname })}
				class="menu-item text-red-500"
			>
				<LogOut class="mr-2 h-4 w-4" />
				<span>Log out</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}

<style>
	.avatar-button {
		@apply h-10 w-10 rounded-full;
	}

	.avatar {
		@apply flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 dark:bg-white/5;
	}

	.avatar-icon {
		@apply h-5 w-5 stroke-foreground/80 dark:stroke-white/80;
	}

	:global(.dropdown-content) {
		@apply fixed w-64 rounded-xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/95;
		animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
		transform-origin: var(--radix-dropdown-menu-content-transform-origin);
		z-index: 9999;
	}

	:global(.separator) {
		@apply my-1 h-px bg-border dark:bg-white/10;
	}

	:global(.menu-item) {
		@apply flex cursor-default items-center px-3 py-2.5 text-sm text-foreground outline-none transition-colors duration-200 hover:bg-foreground/5 active:bg-foreground/10 dark:text-white dark:hover:bg-white/5 dark:active:bg-white/10;
	}

	@keyframes contentShow {
		from {
			opacity: 0;
			transform: translateY(5px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
