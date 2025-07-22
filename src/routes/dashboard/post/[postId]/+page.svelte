<script lang="ts">
	import { columns } from './columns.js';
	import DataTable from './data-table.svelte';

	let { data } = $props();
</script>

<DataTable data={data.payments} {columns} />
