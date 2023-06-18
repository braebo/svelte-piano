<script lang="ts">
	import { Piano, activeKeys, controls, type KeyboardControls } from '$lib'
	import Settings from '$lib/components/controls/Settings.svelte'
	import SpecialKeys from '$components/SpecialKeys.svelte'
	import { OnMount, mobile } from 'fractils'
	import { quintOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
	import { onMount } from 'svelte'

	export let options: KeyboardControls | undefined = undefined

	let piano: Piano

	if (options) {
		$controls = Object.assign($controls, options)
	}

	onMount(() => {
		if ($mobile) {
			$controls.height.value = 200
		}
	})
</script>

<template lang="pug">

	Settings(on:update='{piano.update}')

	OnMount
		.keyboard(in:fly|local='{{ y: 5 , easing: quintOut }}')
			Piano(
				{options}
				bind:this='{piano}'
				'--width'='{$controls.width.value}px'
				'--height'='{$controls.height.value}px'
			)
	
	+if('piano?.keyboard')
		SpecialKeys(keyboard='{piano.keyboard}')

	+if('!$mobile')
		pre.active-keys
			| $activeKeys:
			+each('$activeKeys as key')
				.debug(
					transition:fly='{{ x: 10, duration: 100, easing: quintOut }}'
				) {JSON.stringify(key, null, 2)}

</template>

<style lang="scss">
	.keyboard {
		position: relative;
		z-index: 1;

		margin: auto;
		width: fit-content;
	}

	pre {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 1rem;

		width: 100vw;
		min-height: 7.75rem;
		margin: 0;

		color: var(--light-d);
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
