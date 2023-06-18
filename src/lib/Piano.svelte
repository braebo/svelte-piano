<!-- 
	@component
	A Piano component that can be used to play notes with the keyboard or mouse.
 -->

<script lang="ts">
	import type { KeyboardOptions } from './types'

	import { QwertyKeyboard, activeKeys } from './QwertyKeyboard'
	import { controls, defaultControls } from './controls'
	import Control from './components/Control.svelte'
	import { onDestroy, onMount } from 'svelte'
	import { Instrument } from './Instrument'
	import { atom } from 'nanostores'

	// interface $$Props {
	// 	/**
	// 	 * The intial {@link KeyboardOptions}.
	// 	 * @default undefined
	// 	 */
	// 	options?: KeyboardOptions
	// 	/**
	// 	 * The {@link QwertyKeyboard} to use.  If none is provided, a new one will be created.
	// 	 */
	// 	keyboard?: QwertyKeyboard
	// 	/**
	// 	 * A callback function that will be called whenever the keyboard state changes.
	// 	 */
	// 	update?: (e: CustomEvent) => unknown
	// }

	/**
	 * The intial {@link KeyboardOptions}.
	 * @default undefined
	 */
	export let options: KeyboardOptions | undefined = undefined

	/**
	 * The {@link QwertyKeyboard} to use.  If none is provided, a new one will be created.
	 */
	export const keyboard = new QwertyKeyboard(options)

	/**
	 * A callback function that will be called whenever the keyboard state changes.
	 */
	export function update(e: CustomEvent) {
		if (e.detail.state) {
			// @ts-ignore
			keyboard.state[e.detail.key as keyof QwertyKeyboard['state']] = e.detail.value
		} else {
			keyboard[e.detail.key as keyof QwertyKeyboard] = e.detail.value
		}
	}

	let instrument: Instrument | undefined = undefined
	let mounted = false
	onMount(() => {
		mounted = true
		instrument ??= new Instrument(keyboard)
	})

	onDestroy(() => instrument?.dispose())

	// TODO: Move this somewhere else and do it properly.
	const keyCodes = Object.keys(keyboard.keys).map((code) => {
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

	let dragging = false
	let released = false
	let moved = false
	let lastCode = ''

	let listeningClickUp = false
	const clickUp = () => {
		dragging = false
		keyboard.release(lastCode)
		if (released) return
		released = true
		listeningClickUp = false
	}

	let listeningClickOut = false
	const clickOut = (code: KeyboardEvent['code']) => {
		listeningClickOut = false
		if (released) return
		keyboard.release(code)
		if (dragging) released = true
	}

	const handleClick = (e: KeyboardEvent, code: KeyboardEvent['code'], touch = false) => {
		lastCode = code
		moved = released = false
		dragging = true
		keyboard.press(code)

		if (!listeningClickUp) {
			listeningClickUp = true
			e.preventDefault()
			window?.addEventListener('pointerup', clickUp, { once: true })
		}

		if (!listeningClickOut) {
			listeningClickOut = true
			e.preventDefault()
			window?.addEventListener('pointerout', () => clickOut(code), { once: true })
		}
	}

	let listeningOverOut = false
	const overOut = (code: KeyboardEvent['code']) => {
		listeningOverOut = false
		if (released) return
		keyboard.release(code)
		released = true
	}

	let listeningOverUp = false
	const overUp = (code: KeyboardEvent['code']) => {
		dragging = false
		listeningOverUp = false
		if (released) return
		keyboard.release(code)
		released = true
	}

	const handleMouseOver = (e: KeyboardEvent | TouchEvent, code: KeyboardEvent['code'], touch = false) => {
		lastCode = code
		if (dragging) {
			moved = true
			released = false
			keyboard.press(code)

			if (!listeningOverOut) {
				listeningOverOut = true
				e.preventDefault()
				window?.addEventListener('pointerout', () => overOut(code), { once: true })
			}

			if (!listeningOverUp) {
				listeningOverUp = true
				e.preventDefault()
				window?.addEventListener('pointerup', () => overUp(code), { once: true })
			}
		}
	}

	const touches = new Map<number, KeyboardEvent['code']>()
	const handleTouchMove = (e: TouchEvent) => {
		if (dragging) {
			for (const touch of e.changedTouches) {
				const element = document.elementFromPoint(touch.clientX, touch.clientY)
				if (!element) return

				const code = (element as HTMLElement).dataset.code
				if (!code) return

				if (touches.has(touch.identifier)) {
					const lastCode = touches.get(touch.identifier)
					if (lastCode !== code) {
						keyboard.release(lastCode as KeyboardEvent['code'])
						touches.set(touch.identifier, code)
						keyboard.press(code as KeyboardEvent['code'])
					}
				} else {
					touches.set(touch.identifier, code)
					keyboard.press(code as KeyboardEvent['code'])
				}
			}
		}
	}
	const handleTouchEnd = (e: TouchEvent) => {
		for (const touch of e.changedTouches) {
			const element = document.elementFromPoint(touch.clientX, touch.clientY)
			if (!element) return

			const code = (element as HTMLElement).dataset.code
			if (!code) return

			touches.delete(touch.identifier)
			keyboard.release(code)
		}
		if (touches.size === 0) {
			console.log('resetting')
			dragging = false
			released = true
			keyboard.clear()
		}
	}
</script>

<template lang="pug">
		svelte:window(on:touchmove!='{(e) => handleTouchMove(e)}')

		.keyboard(style="--theme-a: {$controls.theme.value.a}; --theme-b: {$controls.theme.value.b};")
			div.keys.black
				+each('Object.entries(keyboard.keys) as [code, key], i')
					+if('key.color === "black"')
						//- on:touchstart|preventDefault prevents the screen from scrolling when you touch the keyboard.
						div.key.black(
							on:touchstart|preventDefault
							on:touchend!='{(e) => handleTouchEnd(e)}'
							on:touchcancel!='{(e) => handleTouchEnd(e)}'
							on:pointerdown!='{(e) => handleClick(e, code)}'
							on:pointerover!='{(e) => handleMouseOver(e, code)}'
							on:focus!='{(e) => handleMouseOver(e, code)}'
							class:active!='{$activeKeys?.some((k) => k.name === key.name)}'
							style:position='relative'
							data-code='{code}'
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
							on:touchstart|preventDefault
							on:touchend!='{(e) => handleTouchEnd(e)}'
							on:touchcancel!='{(e) => handleTouchEnd(e)}'
							on:pointerdown!='{(e) => handleClick(e, code)}'
							on:pointerover!='{(e) => handleMouseOver(e, code)}'
							on:focus!='{(e) => handleMouseOver(e, code)}'
							class:active!='{$activeKeys?.some((k) => k.name === key.name)}'
							data-code='{code}'
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

		width: var(--width);
		max-width: 95vw;
		height: var(--height);

		user-select: none;
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
			box-shadow: 0 -0.2rem 0.1rem 0.05rem rgba(lighten($dark, 20%), 0.5) inset,
				0 -0.3rem 0.1rem 0.2rem rgba(lighten($dark, 10%), 0.5) inset, 0 -0.2rem 0 0.2rem rgba(lighten($dark, 30%), 0.5) inset;

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
		box-shadow: 0 -0.2rem 0.3rem 0.05rem rgba(lighten($dark, 20%), 0.1) inset, 0 -0.3rem 0.4rem 0.2rem rgba(lighten($dark, 10%), 0.1) inset,
			0 -0.15rem 0 0.2rem rgba(lighten($dark, 20%), 0.1) inset;
	}
</style>
