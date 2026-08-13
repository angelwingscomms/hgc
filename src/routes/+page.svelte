<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import FileRef from '#lib/components/FileRef.svelte';
	import { reveal, reveal_group } from '#lib/actions.js';
	import { site } from '#lib/site.js';
	import { services, testimonials, answers } from '#lib/content.js';

	const year = new Date().getFullYear();
	const hero_lines = ['The system', 'loses people.', 'We keep your file.'];
	const steps = [
		{
			ref: '01',
			head: 'Tell us where you are',
			text: 'Fifteen free minutes. Bring your dates, your documents, and the thing you are afraid of. No pitch at the end.'
		},
		{
			ref: '02',
			head: 'Get the honest read',
			text: 'The options that actually apply to you, the risks of each one said out loud, and the fee in writing before you decide.'
		},
		{
			ref: '03',
			head: 'We file, and you hear from us',
			text: 'You always know which stage you are at and what happens next. Nothing sits in a drawer.'
		}
	];
</script>

<Seo
	title="US immigration lawyer for clients in every state"
	description="Hogan and Crown Law handles family petitions, green cards, citizenship, asylum, deportation defence, and work visas. Free 15 minute call. Based in Dallas, practising nationwide."
/>

<section class="shell pb-band pt-12 md:pt-20">
	<div class="border-rule flex items-baseline justify-between gap-4 border-b pb-4">
		<span class="label">file no.</span>
		<span class="label text-ink">hc · imm · {year}</span>
	</div>

	<div class="pt-10 md:pt-16">
		<p use:reveal class="reveal-target label">matter</p>

		<h1 class="text-display font-display mt-5 max-w-[13ch]">
			{#each hero_lines as line, i (line)}
				<span use:reveal={{ delay: 120 + i * 85 }} class="line-mask">
					<span class="line-inner">{line}</span>
				</span>
			{/each}
		</h1>
	</div>

	<div class="mt-12 max-w-4xl md:mt-16">
		<div class="field-row">
			<span class="label">counsel</span>
			<p use:reveal={{ delay: 420 }} class="reveal-target">
				{site.counsel.name} — admitted in {site.counsel.bars[0]} and {site.counsel.bars[1]}, {site
					.counsel.years} years in practice.
			</p>
		</div>
		<div class="field-row">
			<span class="label">jurisdiction</span>
			<p use:reveal={{ delay: 480 }} class="reveal-target">
				United States immigration law is federal. We represent clients in all fifty states and at
				consulates abroad.
			</p>
		</div>
		<div class="field-row">
			<span class="label">status</span>
			<p use:reveal={{ delay: 540 }} class="reveal-target">
				Accepting new matters. Consultations in English and Spanish.
			</p>
		</div>
		<div class="border-rule border-t pt-8">
			<div use:reveal={{ delay: 600 }} class="reveal-target">
				<Cta />
			</div>
		</div>
	</div>
</section>

<section class="bg-ink text-paper py-band">
	<div class="shell">
		<FileRef ref="!" label="the one thing we wish everyone knew" light />

		<h2 use:reveal={{ delay: 120 }} class="reveal-target text-title mt-8 max-w-[18ch]">
			Leaving triggers the ban. Not the overstay.
		</h2>

		<div class="mt-10 grid gap-8 md:grid-cols-2 md:gap-16">
			<p use:reveal={{ delay: 200 }} class="reveal-target text-rule">
				If you stay past your authorised time, you build unlawful presence. More than one hundred
				and eighty days can bring a three year bar. More than a year can bring a ten year bar. Here
				is the part almost nobody knows: the bar does not switch on while you are inside the
				country. It switches on the moment you leave.
			</p>
			<p use:reveal={{ delay: 260 }} class="reveal-target text-rule">
				So the person who books a flight home to “fix their papers properly” can lock themselves out
				for a decade, on the way to doing the right thing. If you are out of status and thinking
				about travelling, that is the call to make first. It costs you fifteen minutes and it has
				saved people ten years.
			</p>
		</div>

		<div use:reveal={{ delay: 320 }} class="reveal-target mt-10">
			<a href="/answers" class="btn border-rule/40 text-paper border">
				more answers like this
				<span class="arrow" aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</section>

<section class="shell py-band">
	<FileRef ref="§" label="what we handle" />

	<div use:reveal_group={{ step: 45 }} class="mt-12">
		{#each services as s (s.slug)}
			<a
				href="/services/{s.slug}"
				class="reveal-target border-rule group hover:bg-field grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 border-t py-7 transition-colors duration-300 md:grid-cols-[4rem_18rem_1fr] md:gap-x-8"
			>
				<span class="label text-seal">{s.ref}</span>
				<h3 class="text-head font-display">{s.title}</h3>
				<span
					class="text-muted col-start-2 flex items-baseline justify-between gap-6 text-sm md:col-start-3"
				>
					{s.short}
					<span
						class="arrow text-ink transition-transform duration-400 group-hover:translate-x-1"
						aria-hidden="true">→</span
					>
				</span>
			</a>
		{/each}
		<div class="border-rule border-t"></div>
	</div>
</section>

<section class="bg-field py-band">
	<div class="shell">
		<FileRef ref="→" label="how it works" />

		<div use:reveal_group={{ step: 70 }} class="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
			{#each steps as s (s.ref)}
				<div class="reveal-target border-ink border-t pt-6">
					<span class="label text-seal">{s.ref}</span>
					<h3 class="text-head font-display mt-4">{s.head}</h3>
					<p class="text-muted mt-3 text-sm leading-relaxed">{s.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="shell py-band">
	<div class="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
		<div>
			<FileRef ref="◊" label="counsel" />
			<h2 use:reveal={{ delay: 120 }} class="reveal-target text-title mt-8 max-w-[12ch]">
				{site.counsel.name}
			</h2>
		</div>

		<div use:reveal={{ delay: 200 }} class="reveal-target prose-body self-end">
			<p>
				Trained as a lawyer in Nigeria and admitted in New York, with fourteen years across
				corporate and immigration practice and a masters in corporate and financial law.
			</p>
			<p>
				That combination matters more than it sounds. Most clients here have already been through
				one legal system before they meet this one, and they are told to trust a process that has no
				obligation to explain itself. Having practised on both sides of that gap is the difference
				between an explanation and a translation.
			</p>
			<p>
				The firm is deliberately small. You speak to the lawyer handling your matter, not to a case
				number in a queue.
			</p>
			<div class="mt-8">
				<a href="/about" class="btn btn-line">
					more about the firm
					<span class="arrow" aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</div>
</section>

{#if testimonials.length}
	<section class="shell pb-band">
		<div class="border-ink border-t pt-10">
			{#each testimonials.slice(0, 1) as t (t.quote)}
				<blockquote use:reveal class="reveal-target">
					<p class="font-display text-head max-w-[30ch] text-balance">
						“{t.quote}”
					</p>
					<footer class="label mt-6">{t.who}</footer>
				</blockquote>
			{/each}
		</div>
	</section>
{/if}

<section class="bg-ink text-paper py-band">
	<div class="shell">
		<FileRef ref="?" label="common questions" light />
		<div use:reveal_group={{ step: 55 }} class="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
			{#each answers[0].items.slice(0, 4) as item (item.q)}
				<div class="reveal-target border-rule/25 border-t pt-6">
					<h3 class="font-display text-lg leading-snug">{item.q}</h3>
					<p class="text-rule mt-3 text-sm leading-relaxed">{item.a}</p>
				</div>
			{/each}
		</div>
		<div use:reveal={{ delay: 260 }} class="reveal-target mt-12">
			<a href="/answers" class="btn bg-paper text-ink">
				read all the answers
				<span class="arrow" aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</section>
