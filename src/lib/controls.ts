import type { KeyboardControls } from './types'

import { writable } from 'svelte/store'

export const defaultControls: KeyboardControls = {
	width: {
		value: 800,
		label: 'width',
		range: {
			min: 200,
			max: 1500,
			step: 1,
		},
	},
	height: {
		value: 300,
		label: 'height',
		range: {
			min: 100,
			max: 500,
			step: 1,
		},
	},
	polyphony: {
		value: 4,
		label: 'polyphony',
		range: {
			min: 1,
			max: 16,
			step: 1,
		},
	},
	theme: {
		value: {
			a: '#f5f5f5',
			b: '#151515',
		},
		label: 'theme',
	},
	/** Display music note names. */
	notes: {
		value: false,
		label: 'notes',
	},
	/** Display corresponding keyboard keys. */
	keys: {
		value: true,
		label: 'keys',
	},
	/** Use the built-in piano sound. */
	sound: {
		value: true,
		label: 'sound',
	},
}

export const controls = writable<KeyboardControls>(defaultControls)
