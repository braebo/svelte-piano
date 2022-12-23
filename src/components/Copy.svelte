<script lang="ts">
	import { quintOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
	import { Copy } from 'lucide-svelte'
	import { copy } from 'svelte-copy'
	import { onMount } from 'svelte'

	export let text: string = ''
	let copyText = text

	let slotEl: HTMLElement

	// TODO: Animate the copy svg such that the squares merge into
	// a checkbox and a checkmark animates in.
	let copied = false
	let timeout: NodeJS.Timeout
	const handleCopy = () => {
		copied = true
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			copied = false
		}, 2000)
	}

	onMount(() => {
		if (!copyText) {
			const innerText = slotEl!?.innerText
			if (innerText) {
				copyText = innerText
				console.log({ copyText })
			}
		}
	})
</script>

<template lang="pug">

	.copy(
		use:copy='{copyText}' 'on:svelte-copy'!='{() => handleCopy()}'
		class:copied
	)
		.copy-text(bind:this='{slotEl}')
			slot

		.copy-icon
			Copy

		+if('copied')
			.copied(transition:fly='{{ y: -5, duration: 400, easing: quintOut }}')
				| Copied!

</template>

<style lang="scss">
	.copy {
		position: relative;
		overflow: visible;

		width: max-content;
		padding: 0.25rem 0.5rem;

		background: var(--light-a);
		border-radius: var(--radius);
		backdrop-filter: blur(10px);
		// box-shadow: var(--shadow-lg);
		outline: 1px solid transparent;

		transition: 0.15s;
		cursor: pointer;

		pointer-events: all;
		* {
			pointer-events: none;
		}

		.copy-text {
			pointer-events: none;
		}

		.copy-icon {
			position: absolute;
			inset: 0;

			width: fit-content;
			height: 1.4rem;
			margin: auto;

			color: var(--dark-a);
			opacity: 0;

			transition: 0.15s;
		}

		&:hover {
			outline-color: var(--light-d);

			.copy-text {
				opacity: 0.25;
			}

			.copy-icon {
				opacity: 0.75;
			}
		}

		&.copied {
			outline-color: transparent;

			.copy-text {
				opacity: 1;
			}

			.copy-icon {
				opacity: 0;
			}
		}

		.copied {
			position: absolute;
			inset: 0;
			bottom: -5.5rem;

			z-index: 3;

			width: fit-content;
			height: fit-content;
			margin: auto;

			color: var(--dark-d);
			border-radius: var(--radius);

			font-size: var(--font-xxs);
		}
	}
</style>
