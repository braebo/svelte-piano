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
			max: 1000,
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
	notes: {
		value: false,
		label: 'notes',
	},
	keys: {
		value: true,
		label: 'keys',
	},
}

export const controls = writable<KeyboardControls>(defaultControls)
