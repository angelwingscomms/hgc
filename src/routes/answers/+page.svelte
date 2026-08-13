<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import FileRef from '#lib/components/FileRef.svelte';
	import { reveal, reveal_group } from '#lib/actions.js';
	import { answers } from '#lib/content.js';

	const flat = answers.flatMap((g) => g.items);
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: flat.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
</script>

<Seo
	title="Answers to the questions immigrants actually ask"
	description="Plain answers on visa refusals, travel bans, notario fraud, scam calls, the diversity lottery, and what to do if immigration comes to your door."
	{schema}
/>

<section class="shell pt-12 pb-16 md:pt-20">
	<FileRef ref="?" label="answers" />

	<h1 use:reveal={{ delay: 120 }} class="reveal-target text-title font-display mt-8 max-w-[15ch]">
		Straight answers, before you pay anyone.
	</h1>

	<p use:reveal={{ delay: 200 }} class="reveal-target text-muted mt-6 max-w-[52ch]">
		These are the questions we are asked most, answered the way we would answer them on a call. No
		sign-up, no email capture. If something here saves you from a bad decision, it has done its job.
	</p>
</section>

{#each answers as group, gi (group.group)}
	<section class="shell pb-16" class:bg-field={false}>
		<div class="grid gap-8 md:grid-cols-[14rem_1fr] md:gap-16">
			<p class="label border-ink h-fit border-t pt-5 md:sticky md:top-28">{group.group}</p>

			<div use:reveal_group={{ step: 50 }} class="max-w-3xl">
				{#each group.items as f (f.q)}
					<details class="reveal-target border-rule group border-t" open={gi === 0}>
						<summary
							class="font-display flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 text-lg leading-snug"
						>
							{f.q}
							<span
								class="text-seal shrink-0 text-2xl leading-none transition-transform duration-400 group-open:rotate-45"
								aria-hidden="true">+</span
							>
						</summary>
						<p class="text-muted max-w-[62ch] pb-6 text-sm leading-relaxed">{f.a}</p>
					</details>
				{/each}
				<div class="border-rule border-t"></div>
			</div>
		</div>
	</section>
{/each}

<section class="bg-ink text-paper py-band">
	<div class="shell">
		<h2 class="text-title font-display max-w-[16ch]">Your question is not on the list.</h2>
		<p class="text-rule mt-5 max-w-[46ch]">
			Then ask it. The first fifteen minutes are free, and you will get an answer rather than a
			brochure.
		</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<a href="/contact" class="btn bg-paper text-ink">
				ask a question
				<span class="arrow" aria-hidden="true">→</span>
			</a>
			<a href="/services" class="btn border-rule/40 text-paper border">browse services</a>
		</div>
	</div>
</section>
