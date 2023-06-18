<script lang="ts">
	import { QwertyKeyboard, type KeyboardControls, type Range } from '$lib'

	import ColorPickers from '$lib/components/controls/ColorPickers.svelte'
	import Control from '$lib/components/Control.svelte'
	import { createEventDispatcher } from 'svelte'
	import { controls } from '$lib/controls'
	import Checkbox from './Checkbox.svelte'
	import Slider from './Slider.svelte'
	import { OnMount } from 'fractils'

	const dummy = new QwertyKeyboard({ eventListeners: false })
	const keyboardParams = Object.keys(dummy)
	const stateParams = Object.keys(dummy.state)
	dummy.dispose()

	const dispatch = createEventDispatcher()

	const handleRange = (e: CustomEvent, setting: keyof KeyboardControls) => {
		if (typeof $controls[setting].value === 'number') {
			$controls[setting].value = Number(e.detail.value)
		}

		const kbKey = keyboardParams.includes(String(setting))
		const stateKey = stateParams.includes(String(setting))

		if (kbKey || stateKey) {
			dispatch('update', {
				key: setting,
				value: $controls[setting].value,
				state: stateKey,
			})
		}
	}

	const handleBool = (e: CustomEvent, setting: keyof KeyboardControls) => {
		$controls[setting].value = e.detail.value
	}

	// Annoying hack for type casting because Svelte doesn't support TS in markup.
	const getRange = (setting: keyof KeyboardControls) => {
		return ($controls[setting] as Range).range
	}

	const booleanControls = Object.keys($controls).filter((key) => typeof $controls[key].value === 'boolean')
</script>

<template lang="pug">

	.settings
		+if('$controls')
			OnMount
				.range
					+each('Object.keys($controls) as setting, i')
						+if('typeof $controls[setting].value === "number"')
							Control(label='{setting}' i='{i}')
								Slider(
									on:input!='{(e) => handleRange(e, setting)}'
									bind:value='{$controls[setting].value}'
									range='{getRange(setting)}'
									name='{$controls[setting].label}'
								)

				.bool
					Control(label='theme')
						ColorPickers(value!='{$controls.theme}')

					+each('booleanControls as setting, i')
						Control(label='{$controls[setting].label}' i='{i}')
							Checkbox(value!='{!!$controls[setting].value}' on:input!='{(e) => handleBool(e, setting)}')

</template>

<style lang="scss">
	.settings {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;

		min-height: 10rem;
		width: clamp(10rem, 35rem, 95vw);
		margin: 0 auto;
	}
	.range {
		display: flex;
		flex-direction: column;
		width: 125%;
	}
	.bool {
		display: flex;
		flex-direction: column;
		width: 75%;
	}
</style>
