<script lang="ts">
	import type { KeyboardOptions, State } from './types'

	import { controls, defaultControls } from './controls'
	import { QwertyKeyboard, activeKeys } from '$package'
	import Control from '$lib/controls/Control.svelte'
	import { fracpane } from 'fracpane'
	import { atom } from 'nanostores'
	import { onMount } from 'svelte'

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
</script>

<template lang="pug">

		.keyboard(style="--theme-a: {$controls.theme.value.a}; --theme-b: {$controls.theme.value.b};")
			div.keys.black
				+each('Object.entries(keyboard.keys) as [code, key], i')
					+if('key.color === "black"')
						div.key.black(
							class:active!='{$activeKeys.some((k) => k.note === key.note)}'
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
						div.key.white(class:active!='{$activeKeys.some((k) => k.note === key.note)}')
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
