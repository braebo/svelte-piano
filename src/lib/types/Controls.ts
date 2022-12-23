export type Control<T> = {
	value: T
	label: string
}

export interface Range extends Control<number> {
	range: {
		min: number
		max: number
		step: number
	}
}

export interface Text extends Control<string> {
	placeholder: string
}

export type Bool = Control<boolean>

interface ThemeObject {
	a: string
	b: string
}

export type Theme = Control<ThemeObject>

export interface KeyboardControls {
	[key: string]: Range | Bool | Theme
	width: Range
	height: Range
	polyphony: Range
	theme: Theme
	notes: Bool
	keys: Bool
	sound: Bool
}
