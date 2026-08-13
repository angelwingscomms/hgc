<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import FileRef from '#lib/components/FileRef.svelte';
	import { reveal, reveal_group } from '#lib/actions.js';
	import { services } from '#lib/content.js';

	let { data } = $props();
	const s = $derived(data.s);
	const others = $derived(services.filter((x) => x.slug !== s.slug));

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: s.faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	});
</script>

<Seo title={s.title} description={s.lede} {schema} />

<article>
	<section class="shell pt-12 pb-16 md:pt-20">
		<FileRef ref={s.ref} label={s.title} />

		<h1 use:reveal={{ delay: 120 }} class="reveal-target text-title font-display mt-8 max-w-[16ch]">
			{s.lede}
		</h1>

		<div use:reveal={{ delay: 220 }} class="reveal-target prose-body mt-10">
			{#each s.body as p (p)}
				<p>{p}</p>
			{/each}
		</div>

		<div use:reveal={{ delay: 300 }} class="reveal-target mt-10">
			<Cta note={false} />
		</div>
	</section>

	<section class="shell pb-band">
		<div class="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
			<div>
				<p class="label border-ink border-t pt-5">what this covers</p>
				<ul use:reveal_group={{ step: 45 }} class="mt-6 flex flex-col">
					{#each s.covers as c (c)}
						<li class="reveal-target border-rule flex items-baseline gap-4 border-b py-3.5 text-sm">
							<span class="text-seal" aria-hidden="true">—</span>
							{c}
						</li>
					{/each}
				</ul>
			</div>

			<div
				use:reveal={{ delay: 120 }}
				class="reveal-target bg-ink text-paper self-start p-8 md:p-12"
			>
				<p class="label text-rule">{s.watch.head}</p>
				<p class="font-display text-head mt-5 leading-snug text-balance">{s.watch.text}</p>
			</div>
		</div>
	</section>

	<section class="bg-field py-band">
		<div class="shell">
			<FileRef ref="?" label="questions we get on this" />

			<div use:reveal_group={{ step: 50 }} class="mt-10 max-w-3xl">
				{#each s.faqs as f (f.q)}
					<details class="reveal-target border-rule group border-t">
						<summary
							class="font-display flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 text-lg leading-snug"
						>
							{f.q}
							<span
								class="text-seal shrink-0 text-2xl leading-none transition-transform duration-400 group-open:rotate-45"
								aria-hidden="true">+</span
							>
						</summary>
						<p class="text-muted max-w-[60ch] pb-6 text-sm leading-relaxed">{f.a}</p>
					</details>
				{/each}
				<div class="border-rule border-t"></div>
			</div>

			<a href="/answers" class="label wipe mt-10 inline-block">see all answers →</a>
		</div>
	</section>

	<section class="shell py-band">
		<p class="label">other files</p>
		<div use:reveal_group={{ step: 40 }} class="mt-6 grid gap-px md:grid-cols-2">
			{#each others as o (o.slug)}
				<a
					href="/services/{o.slug}"
					class="reveal-target border-rule group hover:bg-field flex items-baseline gap-4 border-t py-5 transition-colors duration-300 md:pr-10"
				>
					<span class="label text-seal">{o.ref}</span>
					<span class="font-display flex-1 text-lg">{o.title}</span>
					<span
						class="arrow transition-transform duration-400 group-hover:translate-x-1"
						aria-hidden="true">→</span
					>
				</a>
			{/each}
			<div class="border-rule border-t md:col-span-2"></div>
		</div>
	</section>
</article>
