<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import FileRef from '#lib/components/FileRef.svelte';
	import { reveal, reveal_group } from '#lib/actions.js';
	import { services } from '#lib/content.js';
</script>

<Seo
	title="Immigration services"
	description="Family petitions, green cards, citizenship, deportation defence, asylum, and business immigration. Handled for clients in every US state."
/>

<section class="shell pt-12 pb-16 md:pt-20">
	<FileRef ref="§" label="index of services" />

	<h1 use:reveal={{ delay: 120 }} class="reveal-target text-title font-display mt-8 max-w-[15ch]">
		Six ways in. One file kept properly.
	</h1>

	<p use:reveal={{ delay: 200 }} class="reveal-target text-muted mt-6 max-w-[52ch]">
		Immigration law is federal, so we act for clients wherever they live in the United States and at
		consulates abroad. If your matter is not listed here, ask anyway — we will tell you plainly
		whether we are the right firm for it.
	</p>
</section>

<section class="shell pb-band">
	<div use:reveal_group={{ step: 60 }} class="grid gap-px md:grid-cols-2">
		{#each services as s (s.slug)}
			<a
				href="/services/{s.slug}"
				class="reveal-target border-rule group hover:bg-field flex flex-col border-t py-8 transition-colors duration-300 md:pr-10"
			>
				<span class="label text-seal">{s.ref}</span>
				<h2 class="text-head font-display mt-4">{s.title}</h2>
				<p class="text-muted mt-3 max-w-[38ch] text-sm leading-relaxed">{s.lede}</p>
				<span class="label mt-6 flex items-center gap-2">
					open file
					<span
						class="arrow transition-transform duration-400 group-hover:translate-x-1"
						aria-hidden="true">→</span
					>
				</span>
			</a>
		{/each}
	</div>
</section>

<section class="bg-field py-band">
	<div class="shell">
		<h2 class="text-title font-display max-w-[16ch]">Not sure which one you need?</h2>
		<p class="text-muted mt-5 max-w-[46ch]">
			Most people are not. Describe your situation in plain words and we will tell you which
			category it falls into and what happens next.
		</p>
		<div class="mt-8"><Cta /></div>
	</div>
</section>
