<script lang="ts">
	import { spring } from 'svelte/motion';
	import { cn } from '$lib/utils';

	export let customClass = '';
	export let delay = 0.2;
	export let reverse = false;
	export let simple = false;

	const containerAnimation = (node: HTMLElement) => {
		const initialY = reverse ? -20 : 20;

		return {
			duration: simple ? 200 : 400,
			delay: delay * 1000,
			easing: simple ? (t: number) => t : spring(0.6),
			css: (t: number) => {
				return `
					opacity: ${t};
					transform: translateY(${initialY * (1 - t)}px);
				`;
			}
		};
	};
</script>

<div use:containerAnimation class={cn('h-full w-full', customClass)}>
	<slot></slot>
</div>
