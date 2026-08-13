<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Cta from '#lib/components/Cta.svelte';
	import FileRef from '#lib/components/FileRef.svelte';
	import { reveal, reveal_group } from '#lib/actions.js';
	import { site } from '#lib/site.js';

	const principles = [
		{
			ref: '01',
			head: 'You get told the bad news first',
			text: 'If your case has a weakness, you hear about it at the first call, not after you have paid. Nobody here quotes a price before they have heard your history.'
		},
		{
			ref: '02',
			head: 'No guarantees, ever',
			text: 'A government officer decides your case, not your lawyer. Anyone who promises you an outcome is selling you something they cannot deliver.'
		},
		{
			ref: '03',
			head: 'You speak to the lawyer',
			text: 'The firm is small on purpose. The person who takes your call is the person handling your matter.'
		},
		{
			ref: '04',
			head: 'Fees in writing, before the work',
			text: 'A written agreement, scope included, before any money moves. No surprise line items later.'
		}
	];
</script>

<Seo
	title="About the firm"
	description="Hogan and Crown Law is a small US immigration practice led by Queenette Hogan, admitted in New York and Nigeria, acting for clients in every state."
/>

<section class="shell pt-12 pb-16 md:pt-20">
	<FileRef ref="03" label="about" />

	<h1 use:reveal={{ delay: 120 }} class="reveal-target text-title font-display mt-8 max-w-[16ch]">
		A small firm, on purpose.
	</h1>

	<div use:reveal={{ delay: 200 }} class="reveal-target prose-body mt-10">
		<p>
			Hogan and Crown Law is a United States immigration practice based in Dallas and acting for
			clients across all fifty states and at consulates abroad. Immigration law is federal, so where
			you live does not limit who can represent you.
		</p>
		<p>
			Most of our clients arrive having already been failed once — by an agent, by a notary who was
			never a lawyer, by a form filed carelessly, or simply by a system that had no obligation to
			explain itself. The work is often as much about putting a file back in order as it is about
			filing something new.
		</p>
	</div>
</section>

<section class="shell pb-band">
	<div class="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
		<div>
			<p class="label border-ink border-t pt-5">counsel</p>
			<h2 use:reveal class="reveal-target text-title font-display mt-6 max-w-[10ch]">
				{site.counsel.name}
			</h2>
			<dl class="mt-8 text-sm">
				<div class="border-rule flex justify-between gap-4 border-t py-3">
					<dt class="label">role</dt>
					<dd>{site.counsel.role}</dd>
				</div>
				<div class="border-rule flex justify-between gap-4 border-t py-3">
					<dt class="label">admitted</dt>
					<dd>{site.counsel.bars.join(' · ')}</dd>
				</div>
				<div class="border-rule flex justify-between gap-4 border-t py-3">
					<dt class="label">in practice</dt>
					<dd>{site.counsel.years} years</dd>
				</div>
				<div class="border-rule flex justify-between gap-4 border-t border-b py-3">
					<dt class="label">languages</dt>
					<dd>English</dd>
				</div>
			</dl>
		</div>

		<div use:reveal={{ delay: 140 }} class="reveal-target prose-body self-end">
			<p>
				Queenette Hogan trained and qualified as a lawyer in Nigeria, then qualified again in New
				York, and holds a masters in corporate and financial law alongside a postgraduate diploma in
				international business practice. Fourteen years of practice spans corporate work and, since
				2023, United States immigration full time.
			</p>
			<p>
				Two legal systems is an unusual background and it turns out to be the useful one here.
				Nearly every client has lived under a different legal culture before meeting this one.
				Knowing what they are comparing it to is the difference between explaining a process and
				translating it.
			</p>
			<p>
				Outside the casework, Queenette publishes free explainers on immigration questions across
				social media, on the view that the information which keeps people out of trouble should not
				sit behind a consultation fee.
			</p>
		</div>
	</div>
</section>

<section class="bg-field py-band">
	<div class="shell">
		<FileRef ref="◊" label="how we work" />
		<div use:reveal_group={{ step: 60 }} class="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-16">
			{#each principles as p (p.ref)}
				<div class="reveal-target border-ink border-t pt-6">
					<span class="label text-seal">{p.ref}</span>
					<h3 class="text-head font-display mt-4">{p.head}</h3>
					<p class="text-muted mt-3 max-w-[42ch] text-sm leading-relaxed">{p.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="shell py-band">
	<div class="grid gap-10 md:grid-cols-2 md:gap-20">
		<div>
			<h2 class="text-title font-display max-w-[14ch]">Where we are.</h2>
			<address class="mt-6 text-sm not-italic">
				{site.address.line1}<br />
				{site.address.line2}<br />
				{site.address.city}, {site.address.region}
				{site.address.postal}
			</address>
			<p class="text-muted mt-4 text-sm">
				{site.hours}<br />
				{site.hours_note}
			</p>
		</div>
		<div class="self-end">
			<Cta />
		</div>
	</div>
</section>
