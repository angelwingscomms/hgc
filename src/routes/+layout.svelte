<script lang="ts">
	import '../app.css';
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import { site } from '#lib/site.js';

	let { children } = $props();

	const org = {
		'@context': 'https://schema.org',
		'@type': 'LegalService',
		name: site.name,
		url: site.url,
		email: site.email,
		telephone: `+1${site.phone_direct.replace(/\D/g, '')}`,
		areaServed: 'US',
		address: {
			'@type': 'PostalAddress',
			streetAddress: `${site.address.line1}, ${site.address.line2}`,
			addressLocality: site.address.city,
			addressRegion: site.address.region,
			postalCode: site.address.postal,
			addressCountry: site.address.country
		},
		openingHours: 'Mo-Fr 08:00-16:30',
		sameAs: site.social.map((s) => s.url),
		knowsLanguage: ['en', 'es'],
		employee: {
			'@type': 'Attorney',
			name: site.counsel.name,
			jobTitle: site.counsel.role
		}
	};

	const org_ld = `<script type="application/ld+json">${JSON.stringify(org)}<\u002Fscript>`;
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- own object, JSON.stringify, no user input -->
	{@html org_ld}
</svelte:head>

<div class="grain" aria-hidden="true"></div>

<a
	href="#main"
	class="btn btn-seal sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[70]"
>
	skip to content
</a>

<Nav />

<main id="main" class="pt-16 pb-14 md:pt-20 md:pb-0">
	{@render children()}
</main>

<Footer />
