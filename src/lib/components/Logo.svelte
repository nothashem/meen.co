<script lang="ts">
	import { cn } from '@/utils';

	export let className: string = '';
</script>

<div class={cn('z-10 flex h-10 items-center justify-center', className)}>
	<a href="/" class="relative flex items-center justify-center">
		<div
			class="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-indigo-600 opacity-75 blur-sm"
		></div>
		<div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
			<span class="text-lg font-bold text-primary-foreground">M</span>
		</div>
	</a>
</div>
