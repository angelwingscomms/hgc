<script lang="ts">
	import { site, whatsapp_link, tel_link } from '#lib/site.js';
	import { reveal, reveal_group } from '#lib/actions.js';
	import { services } from '#lib/content.js';

	let clock = $state('');
	const year = new Date().getFullYear();

	$effect(() => {
		const tick = () =>
			(clock = new Intl.DateTimeFormat('en-US', {
				timeZone: 'America/Chicago',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			}).format(new Date()));
		tick();
		const id = setInterval(tick, 30_000);
		return () => clearInterval(id);
	});
</script>

<footer class="bg-ink text-paper">
	<div class="shell pt-band-lg pb-16">
		<p use:reveal class="reveal-target label text-rule">closing note</p>

		<h2 use:reveal={{ delay: 80 }} class="reveal-target text-title mt-6 max-w-[16ch]">
			The first fifteen minutes cost nothing.
		</h2>

		<p use:reveal={{ delay: 160 }} class="reveal-target text-rule mt-6 max-w-[46ch]">
			Tell us where you are in the process. We will tell you what your real options are, what could
			go wrong, and what it costs — before you decide anything.
		</p>

		<div use:reveal={{ delay: 240 }} class="reveal-target mt-10 flex flex-wrap gap-3">
			<a href={site.booking} class="btn bg-paper text-ink">
				book a free call
				<span class="arrow" aria-hidden="true">→</span>
			</a>
			<a href={whatsapp_link()} rel="noopener" class="btn border-rule/40 text-paper border">
				whatsapp
			</a>
		</div>

		<div class="bg-rule/25 mt-20 h-px w-full"></div>

		<div use:reveal_group class="grid gap-12 pt-12 md:grid-cols-[1.2fr_1fr_1fr]">
			<div class="reveal-target">
				<p class="label text-rule">office</p>
				<address class="mt-4 text-sm not-italic">
					{site.address.line1}<br />
					{site.address.line2}<br />
					{site.address.city}, {site.address.region}
					{site.address.postal}
				</address>
				<p class="text-rule mt-4 text-sm">
					{site.hours}<br />
					{site.hours_note}
				</p>
				<p class="label text-rule mt-6">
					Dallas — {clock || '—'}
				</p>
			</div>

			<div class="reveal-target">
				<p class="label text-rule">reach us</p>
				<ul class="mt-4 flex flex-col gap-2 text-sm">
					<li><a class="wipe" href="mailto:{site.email}">{site.email}</a></li>
					<li>
						<a class="wipe" href={tel_link(site.phone_direct)}>{site.phone_direct} — direct</a>
					</li>
					<li>
						<a class="wipe" href={tel_link(site.phone_office)}>{site.phone_office} — office</a>
					</li>
					<li><a class="wipe" href={whatsapp_link()} rel="noopener">WhatsApp</a></li>
				</ul>
				<p class="label text-rule mt-6">follow</p>
				<ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
					{#each site.social as s (s.url)}
						<li><a class="wipe" href={s.url} rel="noopener">{s.label}</a></li>
					{/each}
				</ul>
			</div>

			<div class="reveal-target">
				<p class="label text-rule">practice</p>
				<ul class="mt-4 flex flex-col gap-2 text-sm">
					{#each services as s (s.slug)}
						<li><a class="wipe" href="/services/{s.slug}">{s.title}</a></li>
					{/each}
					<li><a class="wipe" href="/answers">Common questions</a></li>
				</ul>
			</div>
		</div>

		<div class="bg-rule/25 mt-16 h-px w-full"></div>

		<div class="text-rule mt-8 flex flex-col gap-6 text-xs md:flex-row md:justify-between">
			<p class="max-w-[62ch] leading-relaxed">
				Attorney advertising. This website is general information, not legal advice, and reading it
				does not create an attorney–client relationship. {site.counsel.name} is admitted in {site
					.counsel.bars[0]} and {site.counsel.bars[1]}. United States immigration law is federal, so
				we represent clients in every state. We do not advise on Texas state law.
			</p>
			<p class="shrink-0">
				© {year}
				{site.name}
			</p>
		</div>
	</div>
</footer>
