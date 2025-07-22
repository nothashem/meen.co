<script lang="ts">
	import { SignIn } from '@auth/sveltekit/components';
	import { Linkedin, LoaderCircle } from '@lucide/svelte';

	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/ui/button';

	let isLinkedinLoading = $state(false);
</script>

<div
	class="container mx-auto flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center py-10"
>
	<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
		<div class="flex w-full flex-col text-center">
			<div>
				<div class="flex justify-center">
					<Logo className="h-8 w-8" />
				</div>
				<h1 class="mt-4 text-center text-2xl">Create your account</h1>
				<p class="mt-2 text-sm text-muted-foreground">Create an account to start using Meen</p>
			</div>

			<div>
				<div class="flex flex-col gap-4 py-8">
					<div class="w-full">
						<Button
							size="lg"
							type="button"
							variant="tertiary"
							disabled={isLinkedinLoading}
							onclick={() => {
								isLinkedinLoading = true;
							}}
							class="w-full"
						>
							{#if isLinkedinLoading}
								<LoaderCircle class="h-4 w-4 animate-spin" />
							{:else}
								<Linkedin class="h-4 w-4" />
							{/if}
							{#if page.params.redirect}
								<SignIn
									provider="linkedin"
									redirect={`/auth/signin/linkedin?redirect=${page.params.redirect}`}
								/>
							{:else}
								<SignIn provider="linkedin" redirect={`${page.url.origin}/dashboard`} />
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</div>

		<p class="px-8 text-center text-sm text-muted-foreground">
			By clicking continue, you agree to our
			<a href="/terms" class="underline underline-offset-4 hover:text-primary"
				>Terms and Conditions</a
			>
			and
			<a href="/privacy" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
		</p>
	</div>
</div>
