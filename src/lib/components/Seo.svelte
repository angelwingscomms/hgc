<script lang="ts">
	import { page } from '$app/state';
	import { site } from '#lib/site.js';

	let {
		title,
		description,
		schema = null
	}: { title: string; description: string; schema?: object | null } = $props();

	const full = $derived(`${title} — ${site.name}`);
	const url = $derived(site.url + page.url.pathname);
	const json_ld = $derived(
		schema ? `<script type="application/ld+json">${JSON.stringify(schema)}<\u002Fscript>` : ''
	);
</script>

<svelte:head>
	<title>{full}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={full} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content="{site.url}/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	{#if schema}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- own object, JSON.stringify, no user input -->
		{@html json_ld}
	{/if}
</svelte:head>
