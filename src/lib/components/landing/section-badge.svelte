<script lang="ts">
	export let title: string;
</script>

<div class="cursor-pointer select-none rounded-full bg-primary/20 px-4 py-1">
	<div
		class="animate-background-shine bg-[linear-gradient(110deg,#6d28d9,45%,#c4b5fd,55%,#6d28d9)] bg-[length:250%_100%] bg-clip-text text-sm font-medium text-transparent"
	>
		{title}
	</div>
</div>
