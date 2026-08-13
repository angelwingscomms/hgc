<script lang="ts">
	import { page } from '$app/state';
	import { services } from '#lib/content.js';
</script>

<svelte:head><title>No such file — Hogan and Crown Law</title></svelte:head>

<section class="shell pb-band pt-16 md:pt-24">
	<div class="border-rule flex items-baseline justify-between gap-4 border-b pb-4">
		<span class="label">file no.</span>
		<span class="label text-seal">{page.status}</span>
	</div>

	<h1 class="text-display font-display mt-12 max-w-[10ch]">No such file.</h1>

	<p class="text-muted mt-8 max-w-[46ch]">
		Nothing is lost. That page was simply never filed under this name. Try one of these instead.
	</p>

	<div class="mt-12 max-w-3xl">
		{#each services as s (s.slug)}
			<a
				href="/services/{s.slug}"
				class="border-rule group hover:bg-field flex items-baseline gap-4 border-t py-4 transition-colors duration-300"
			>
				<span class="label text-seal">{s.ref}</span>
				<span class="font-display flex-1 text-lg">{s.title}</span>
				<span
					class="arrow transition-transform duration-400 group-hover:translate-x-1"
					aria-hidden="true">→</span
				>
			</a>
		{/each}
		<a
			href="/"
			class="border-rule group hover:bg-field flex items-baseline gap-4 border-y py-4 transition-colors duration-300"
		>
			<span class="label text-seal">←</span>
			<span class="font-display flex-1 text-lg">Back to the beginning</span>
		</a>
	</div>
</section>
