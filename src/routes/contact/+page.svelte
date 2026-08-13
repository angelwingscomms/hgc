<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import FileRef from '#lib/components/FileRef.svelte';
	import { reveal } from '#lib/actions.js';
	import { ctrl_enter } from '#lib/actions.js';
	import { site, whatsapp_link, tel_link } from '#lib/site.js';
	import { services } from '#lib/content.js';

	let who = $state('');
	let matter = $state('');
	let stage = $state('');
	let question = $state('');

	const stages = [
		'I have not started yet',
		'My application is pending',
		'I received a request for evidence',
		'I was refused or denied',
		'I have a court date',
		'Someone I know is detained'
	];

	const message = $derived(
		[
			who && `Name: ${who}`,
			matter && `Matter: ${matter}`,
			stage && `Stage: ${stage}`,
			question && `Question: ${question}`
		]
			.filter(Boolean)
			.join('\n') || "Hello, I'd like to ask about my immigration case."
	);

	const send = () => window.open(whatsapp_link(message), '_blank', 'noopener');

	const mail_link = $derived(
		`mailto:${site.email}?subject=${encodeURIComponent('Immigration enquiry')}&body=${encodeURIComponent(message)}`
	);
</script>

<Seo
	title="Contact"
	description="Book a free 15 minute call, send a WhatsApp message, or email us. Dallas office, clients in every US state."
/>

<section class="shell pt-12 pb-16 md:pt-20">
	<FileRef ref="04" label="contact" />

	<h1 use:reveal={{ delay: 120 }} class="reveal-target text-title font-display mt-8 max-w-[14ch]">
		Tell us where you are.
	</h1>

	<p use:reveal={{ delay: 200 }} class="reveal-target text-muted mt-6 max-w-[50ch]">
		The fastest route is WhatsApp — most of our clients use it, and you will usually hear back the
		same working day. The form below just writes the message for you so nothing important gets left
		out.
	</p>
</section>

<section class="shell pb-band">
	<div class="grid gap-16 md:grid-cols-[1.2fr_1fr] md:gap-24">
		<form
			class="max-w-xl"
			use:ctrl_enter={send}
			onsubmit={(e) => {
				e.preventDefault();
				send();
			}}
		>
			<div class="field-row !grid-cols-1 !border-t-0 !pt-0">
				<label class="label" for="who">your name</label>
				<input id="who" class="input" bind:value={who} placeholder="First and last name" />
			</div>

			<div class="field-row !grid-cols-1">
				<label class="label" for="matter">what is it about</label>
				<select id="matter" class="input" bind:value={matter}>
					<option value="">Choose one</option>
					{#each services as s (s.slug)}
						<option value={s.title}>{s.title}</option>
					{/each}
					<option value="Something else">Something else</option>
				</select>
			</div>

			<div class="field-row !grid-cols-1">
				<label class="label" for="stage">where you are now</label>
				<select id="stage" class="input" bind:value={stage}>
					<option value="">Choose one</option>
					{#each stages as s (s)}
						<option value={s}>{s}</option>
					{/each}
				</select>
			</div>

			<div class="field-row !grid-cols-1">
				<label class="label" for="question">your question</label>
				<textarea
					id="question"
					class="input resize-y"
					rows="4"
					bind:value={question}
					placeholder="Dates and documents help. Do not send anything confidential yet."></textarea>
			</div>

			<div class="border-rule flex flex-col gap-4 border-t pt-8">
				<div class="flex flex-wrap gap-3">
					<button type="submit" class="btn btn-seal">
						send on whatsapp
						<span class="arrow" aria-hidden="true">→</span>
					</button>
					<a href={mail_link} class="btn btn-line">send by email instead</a>
				</div>
				<p class="label !normal-case">Press Ctrl + Enter to send.</p>
			</div>
		</form>

		<div class="flex flex-col gap-10">
			<div>
				<p class="label border-ink border-t pt-5">book a call</p>
				<p class="text-muted mt-4 text-sm">
					Fifteen minutes, free, no pitch. Pick a time that suits you.
				</p>
				<a href={site.booking} class="btn btn-seal mt-5">
					open the calendar
					<span class="arrow" aria-hidden="true">→</span>
				</a>
			</div>

			<div>
				<p class="label border-ink border-t pt-5">direct</p>
				<ul class="mt-4 flex flex-col gap-2 text-sm">
					<li><a class="wipe" href={whatsapp_link()} rel="noopener">WhatsApp</a></li>
					<li>
						<a class="wipe" href={tel_link(site.phone_direct)}>{site.phone_direct} — direct</a>
					</li>
					<li>
						<a class="wipe" href={tel_link(site.phone_office)}>{site.phone_office} — office</a>
					</li>
					<li><a class="wipe" href="mailto:{site.email}">{site.email}</a></li>
					<li class="text-muted">{site.fax} — fax</li>
				</ul>
			</div>

			<div>
				<p class="label border-ink border-t pt-5">office</p>
				<address class="mt-4 text-sm not-italic">
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

			<div class="bg-field p-6">
				<p class="label">if it is urgent</p>
				<p class="mt-3 text-sm leading-relaxed">
					If someone has been detained or you have a hearing within days, call the direct line
					rather than using this form. Have the alien registration number and the facility name
					ready if you can.
				</p>
			</div>
		</div>
	</div>
</section>
