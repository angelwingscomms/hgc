<script lang="ts">
	import { site, whatsapp_link } from '#lib/site.js';

	let { note = true }: { note?: boolean } = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap gap-3">
		<a href={site.booking} class="btn btn-seal">
			book a free 15 minute call
			<span class="arrow" aria-hidden="true">→</span>
		</a>
		<a href={whatsapp_link()} class="btn btn-line" rel="noopener">message on whatsapp</a>
	</div>
	{#if note}
		<p class="text-muted text-sm">No pitch. If we are not the right fit we will say so.</p>
	{/if}
</div>
