<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { site, nav_links, whatsapp_link, tel_link } from '#lib/site.js';
	import { trap_focus } from '#lib/actions.js';

	let open = $state(false);
	const here = $derived(page.url.pathname);
	const is_on = (href: string) => here === href || here.startsWith(href + '/');

	$effect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	afterNavigate(() => (open = false));
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<header class="border-rule bg-paper fixed inset-x-0 top-0 z-50 border-b">
	<div class="shell flex h-16 items-center justify-between gap-6 md:h-20">
		<a href="/" class="group flex items-baseline gap-2.5" aria-label="{site.name} — home">
			<span class="font-display text-xl leading-none tracking-tight md:text-2xl">
				Hogan &amp; Crown
			</span>
			<span class="label hidden lg:inline">law</span>
		</a>

		<nav class="hidden items-center gap-8 md:flex" aria-label="Main">
			{#each nav_links as l (l.href)}
				<a
					href={l.href}
					class="group flex items-baseline gap-1.5 text-sm"
					aria-current={is_on(l.href) ? 'page' : undefined}
				>
					<span class="label text-[0.5625rem]">{l.ref}</span>
					<span
						class="wipe"
						class:underline={is_on(l.href)}
						class:underline-offset-4={is_on(l.href)}
					>
						{l.label}
					</span>
				</a>
			{/each}
			<a href={site.booking} class="btn btn-seal !min-h-0 !px-4 !py-2.5">book a call</a>
		</nav>

		<button
			class="label flex items-center gap-2 py-3 md:hidden"
			aria-expanded={open}
			aria-controls="menu"
			onclick={() => (open = !open)}
		>
			{open ? 'close' : 'menu'}
			<span class="flex w-5 flex-col gap-1" aria-hidden="true">
				<span class="bg-ink h-px w-full"></span>
				<span class="bg-ink h-px w-full"></span>
			</span>
		</button>
	</div>
</header>

{#if open}
	<div
		id="menu"
		class="bg-paper fixed inset-0 z-40 flex flex-col justify-between pt-24 pb-28 md:hidden"
		use:trap_focus={open}
	>
		<nav class="shell flex flex-col" aria-label="Main">
			{#each nav_links as l (l.href)}
				<a href={l.href} class="border-rule flex items-baseline gap-4 border-b py-5">
					<span class="label">{l.ref}</span>
					<span class="font-display text-head">{l.label}</span>
				</a>
			{/each}
		</nav>

		<div class="shell flex flex-col gap-3">
			<a class="label" href="mailto:{site.email}">{site.email}</a>
			<a class="label" href={tel_link(site.phone_direct)}>{site.phone_direct}</a>
		</div>
	</div>
{/if}

<div class="border-rule bg-paper fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t md:hidden">
	<a
		href={tel_link(site.phone_direct)}
		class="label border-rule flex min-h-14 items-center justify-center border-r"
	>
		call
	</a>
	<a
		href={whatsapp_link()}
		rel="noopener"
		class="label border-rule flex min-h-14 items-center justify-center border-r"
	>
		whatsapp
	</a>
	<a href={site.booking} class="label bg-seal text-paper flex min-h-14 items-center justify-center">
		book
	</a>
</div>
