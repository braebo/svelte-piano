<script lang="ts">
	import { controls, type KeyboardControls } from '$lib'
	import { onDestroy, onMount } from 'svelte'
	import { quintOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
	import { Copy } from 'lucide-svelte'
	import { copy } from 'svelte-copy'

	export let options = [] as unknown[]
	export let styles = [] as unknown[]

	let slotEl: HTMLElement

	// @ts-ignore
	$: optionProps = options.map(([k, v]) => `\n\t\t${k}: ${v.value}`).join(',') ?? ''

	$: optionsText = optionProps.length ? `\n\toptions={${optionProps}\n\t}` : ''

	// @ts-ignore
	$: styleProps = styles.map((prop) => `\n\t--${prop}='${$controls[prop].value}px'`).join('')

	$: closingTag = optionProps.concat(styleProps).length > 0 ? '\n/>' : '/>'

	const copyText = async () => {
		const text = `<script>
	import { Piano } from 'svelte-piano'
${'<'}/script>

<Piano${optionsText}${styleProps}${closingTag}`
		console.log(text)
		await navigator.clipboard.writeText(text)
		animate()
	}

	let copied = false
	let timeout: NodeJS.Timeout
	const animate = () => {
		copied = true
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			copied = false
		}, 2000)
	}

	onDestroy(() => clearTimeout(timeout))
</script>

<template lang="pug">

	.copy(
		on:pointerdown='{copyText}'
		class:copied
	)
		.copy-text(bind:this='{slotEl}')
			slot

		.copy-icon
			Copy(size='{15}')

		+if('copied')
			.copied(transition:fly='{{ y: -5, duration: 400, easing: quintOut }}')
				| Copied!

</template>

<style lang="scss">
	.copy {
		position: relative;
		overflow: visible;

		display: flex;
		align-items: center;

		width: max-content;
		width: 100%;
		height: 100%;
		padding: 0.25rem 0.5rem;

		background: var(--light-a);
		border-radius: var(--radius);
		backdrop-filter: blur(10px);
		outline: 1px solid transparent;

		transition: 0.15s;
		cursor: pointer;

		overflow: hidden;
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
			height: 1rem;
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
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			inset: 0;

			z-index: 3;

			// width: fit-content;
			// height: fit-content;
			width: 100%;
			height: 100%;
			padding: 1rem;
			margin: auto;

			background: rgba(var(--light-a-rgb), 0.95);
			color: lightgreen;
			text-shadow: 0 0 1rem hsla(120, 73%, 75%, 0.5);
			border-radius: var(--radius);

			font-size: var(--font-xs);
		}
	}
</style>
