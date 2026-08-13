import type { Action } from 'svelte/action';

const motion_ok = () =>
	typeof matchMedia === 'undefined' ||
	matchMedia('(prefers-reduced-motion: no-preference)').matches;

export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, params) => {
	const delay = params?.delay ?? 0;
	if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

	if (!motion_ok()) {
		node.dataset.shown = 'true';
		return;
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (!e.isIntersecting) continue;
				(e.target as HTMLElement).dataset.shown = 'true';
				io.unobserve(e.target);
			}
		},
		{ rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
	);

	io.observe(node);
	return { destroy: () => io.disconnect() };
};

export const reveal_group: Action<HTMLElement, { step?: number; select?: string } | undefined> = (
	node,
	params
) => {
	const step = params?.step ?? 55;
	const kids = [...node.querySelectorAll<HTMLElement>(params?.select ?? ':scope > *')];
	kids.forEach((k, i) => k.style.setProperty('--reveal-delay', `${i * step}ms`));

	if (!motion_ok()) {
		kids.forEach((k) => (k.dataset.shown = 'true'));
		return;
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (!e.isIntersecting) continue;
				kids.forEach((k) => (k.dataset.shown = 'true'));
				io.disconnect();
			}
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
	);

	io.observe(node);
	return { destroy: () => io.disconnect() };
};

export const ctrl_enter: Action<HTMLElement, () => void> = (node, fn) => {
	let run = fn;
	const on_key = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			run();
		}
	};
	node.addEventListener('keydown', on_key);
	return {
		update: (next) => (run = next),
		destroy: () => node.removeEventListener('keydown', on_key)
	};
};

export const ctrlEnter = ctrl_enter;

export const trap_focus: Action<HTMLElement, boolean> = (node, active) => {
	let prev: HTMLElement | null = null;

	const on_key = (e: KeyboardEvent) => {
		if (e.key !== 'Tab') return;
		const items = node.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		if (!items.length) return;
		const first = items[0];
		const last = items[items.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	const apply = (on: boolean) => {
		if (on) {
			prev = document.activeElement as HTMLElement;
			node.addEventListener('keydown', on_key);
			node.querySelector<HTMLElement>('a[href], button')?.focus();
		} else {
			node.removeEventListener('keydown', on_key);
			prev?.focus();
			prev = null;
		}
	};

	apply(active);
	return {
		update: (next) => apply(next),
		destroy: () => node.removeEventListener('keydown', on_key)
	};
};
