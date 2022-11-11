<script lang="ts">
	import { Keyboard, activeKeys, controls, type KeyboardControls } from '$package'
	import Settings from '$lib/controls/Settings.svelte'

	export let options: KeyboardControls | undefined = undefined

	let keyboard: Keyboard

	if (options) {
		$controls = Object.assign($controls, options)
	}
</script>

<template lang="pug">

	Settings(on:update='{keyboard.update}')

	.keyboard
		+key('$controls')
			Keyboard(
				{options}
				bind:this='{keyboard}'
				'--width'='{$controls.width.value}px'
				'--height'='{$controls.height.value}px'
			)

	pre.active-keys
		| $activeKeys:
		+each('$activeKeys as key')
			.debug {JSON.stringify(key, null, 2)}

</template>

<style lang="scss">
	.keyboard {
		margin: auto;
		width: fit-content;
	}

	pre {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;

		width: 100vw;
		min-height: 7rem;
		margin: 0;

		color: var(--light-d);
		background: var(--light-c);
		border-radius: var(--radius);
		filter: contrast(1.1);

		font-size: var(--font-xxs);

		overflow-x: hidden;
		z-index: 2;
	}

	.active-keys {
		display: flex;
		gap: 2rem;
	}
</style>
