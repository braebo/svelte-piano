<script lang="ts">
	import type { KeyboardOptions } from './types'

	import Control from '$components/controls/Control.svelte'
	import { controls, defaultControls } from './controls'
	import { QwertyKeyboard, activeKeys } from '$lib'
	import { onDestroy, onMount } from 'svelte'
	import { Instrument } from './Instrument'
	import { atom } from 'nanostores'

	export let options: KeyboardOptions | undefined = undefined

	const keyboard = new QwertyKeyboard(options)

	export function update(e: CustomEvent) {
		if (e.detail.state) {
			// @ts-expect-error - too tired to investigate this one.
			keyboard.state[e.detail.key as keyof QwertyKeyboard['state']] = e.detail.value
		} else {
			keyboard[e.detail.key as keyof QwertyKeyboard] = e.detail.value
		}
	}

	let instrument: Instrument | undefined = undefined
	let mounted = false
	onMount(() => {
		mounted = true
		if (typeof instrument === 'undefined') instrument = new Instrument(keyboard)
	})

	// $: if ($controls.sound.value) {
	// 	if (mounted && !instrument?.selectedInstrument) instrument = new Instrument(keyboard)
	// }

	$: if (!$controls.sound.value && mounted) {
		console.log('dispose')
		// instrument?.dispose()
		// instrument = undefined
	}

	onDestroy(() => instrument?.dispose())

	// TODO: Move this somewhere else and do it properly.
	const keyCodes = Object.keys(keyboard.keys).map((code) => {
		// lol
		return code
			.replace('Key', '')
			.replace('Digit', '')
			.replace('Semicolon', ';')
			.replace('Quote', '"')
			.replace('Comma', ',')
			.replace('Period', '.')
			.replace('Slash', '/')
			.replace('Backquote', '`')
			.replace('BracketLeft', '[')
			.replace('BracketRight', ']')
			.replace('Backslash', '\\')
			.replace('Minus', '-')
			.replace('Equal', '=')
	})

	// TODO: Move this stuff to an action.
	let dragging = false
	let released = false
	let moved = false
	let lastCode = ''
	const handleClick = (code: KeyboardEvent['code']) => {
		lastCode = code
		moved = released = false
		dragging = true
		keyboard.press(code)
		window?.addEventListener(
			'mouseup',
			() => {
				dragging = false
				keyboard.release(lastCode)
				if (released) return
				released = true
			},
			{ once: true },
		)
		window?.addEventListener(
			'mouseout',
			() => {
				if (released) return
				keyboard.release(code)
				if (dragging) released = true
			},
			{ once: true },
		)
	}

	const handleMouseOver = (code: KeyboardEvent['code']) => {
		lastCode = code
		if (dragging) {
			moved = true
			released = false
			keyboard.press(code)
			window?.addEventListener(
				'mouseout',
				() => {
					if (released) return
					keyboard.release(code)
					released = true
				},
				{ once: true },
			)
			window?.addEventListener(
				'mouseup',
				() => {
					dragging = false
					if (released) return
					keyboard.release(code)
					released = true
				},
				{ once: true },
			)
		}
	}
</script>

<template lang="pug">

		.keyboard(style="--theme-a: {$controls.theme.value.a}; --theme-b: {$controls.theme.value.b};")
			div.keys.black
				+each('Object.entries(keyboard.keys) as [code, key], i')
					+if('key.color === "black"')
						div.key.black(
							on:mousedown!='{() => handleClick(code)}'
							on:mouseover!='{() => handleMouseOver(code)}'
							on:focus!='{() => handleMouseOver(code)}'
							class:active!='{$activeKeys?.some((k) => k.name === key.name)}'
							style:position="relative"
						)
							.text
								+if('$controls.notes.value')
									.name {key.name}
								+if('$controls.keys.value')
									.code {keyCodes[i]}

						//- White keys
						+elseif('![2, 7, 9, 14].includes(i)')
							.spacer

			div.keys.white
				+each('Object.entries(keyboard.keys) as [code, key], i')
					+if('key.color === "white"')
						div.key.white(
							on:mousedown!='{() => handleClick(code)}'
							on:mouseover!='{() => handleMouseOver(code)}'
							on:focus!='{() => handleMouseOver(code)}'
							class:active!='{$activeKeys?.some((k) => k.name === key.name)}'
						)
							.text
								+if('$controls.notes.value')
									.name {key.name}
								+if('$controls.keys.value')
									.code {keyCodes[i]}

</template>

<style lang="scss">
	$dark: #151515;
	$light: #f5f5f5;

	.keyboard {
		display: flex;
		flex-direction: column;
		position: relative;

		width: clamp(400px, var(--width), 90vw);
		height: var(--height);
	}

	.keys {
		display: flex;
		justify-content: space-evenly;

		height: 100%;
	}

	.key {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 1rem;

		height: 100%;

		background: $light;
		border-radius: 0.25rem;

		font-weight: 800;

		overflow-x: hidden;
		cursor: pointer;

		&.black {
			z-index: 2;

			width: 5%;

			background: var(--theme-b, $dark);
			color: mix($light, $dark, 75%);

			font-size: var(--font-xxs);

			transform: translate(-45%, 24%);
		}

		&.white {
			width: 100%;
			height: 150%;

			box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1), 1px -1px 0.25rem rgba(0, 0, 0, 0.25) inset;
			background: var(--theme-a, $light);
			color: mix($dark, $light, 75%);

			font-size: var(--font-xs);

			transform: translateY(-50%);
		}

		.text {
			display: flex;
			flex-direction: column;
			align-items: center;

			pointer-events: none;
			user-select: none;

			.code {
				font-family: monospace;
				font-weight: 400;
				transform: translateY(2px);
			}
		}
	}

	.key.active {
		border-color: var(--brand-a);
		background: var(--brand-a);
		color: $dark;
	}
</style>
