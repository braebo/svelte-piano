<script lang="ts">
	import Copy from './Copy.svelte'
</script>

<template lang="pug">

	.install
		Copy
			pre pnpm i -D fractalhq/qwerty-keyboard

</template>

<style lang="scss">
	.install {
		margin: 0 auto;
		width: fit-content;
		box-shadow: var(--shadow-sm);
	}

	pre {
		margin: auto;
		color: var(--brand-a);
		font-size: var(--font-xs);
		font-family: monospace;
		pointer-events: none;
	}

	:global(html[theme='light']) {
		pre {
			filter: brightness(0.5);
		}
	}
</style>
