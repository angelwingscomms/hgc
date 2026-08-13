<script lang="ts">
	import { reveal } from '#lib/actions.js';

	let {
		ref,
		label,
		delay = 0,
		light = false
	}: { ref: string; label: string; delay?: number; light?: boolean } = $props();
</script>

<div class="flex items-center gap-3">
	<span
		use:reveal={{ delay }}
		class="stamp-target label inline-block border px-2 py-1.5"
		class:border-seal={!light}
		class:text-seal={!light}
		class:border-paper={light}
		class:text-paper={light}
	>
		{ref}
	</span>
	<span use:reveal={{ delay: delay + 90 }} class="reveal-target label" class:text-rule={light}>
		{label}
	</span>
</div>
