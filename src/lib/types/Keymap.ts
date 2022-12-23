/**
 * Metadata mapping to a computer keyboard key to a piano key.
 */
export interface Key {
	/**
	 * The corresponding note name. For example, `C#4`.
	 */
	name: string

	/**
	 * The corresponding midi number.
	 * @remarks This is the same as the `note` property of the {@link Note} object.
	 * @see {@link https://en.wikipedia.org/wiki/MIDI_tuning_standard MIDI Tuning Standard},
	 * and {@link https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies MIDI Note Numbers and Frequencies}
	 */
	midi: number

	/**
	 * Whether the key is black or white.
	 */
	color: 'white' | 'black'

	/**
	 * The corresponding computer keyboard key.
	 */
	key: string
}

/**
 * A map of the computer keyboard keys to their corresponding piano {@link Key}s.
 */
export type Keymap = Record<KeyboardEvent['code'], Key>

export interface SpecialKey {
	type: 'octave' | 'velocity'
	value: number
}

/**
 * Maps Z and X to octave up and down, respectively, and
 * maps numbers 1-9 and 0 to velocity 1-127.
 */
export type SpecialKeymap = Record<KeyboardEvent['code'], SpecialKey>
