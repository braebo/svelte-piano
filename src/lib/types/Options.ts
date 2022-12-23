import type { Keymap, SpecialKeymap } from './Keymap'
import type { Note } from './Note'

export interface KeyboardOptions {
	/**
	 * The number of keys that can be active simultaneously.
	 * @default 10
	 */
	polyphony: number

	/**
	 * The number of rows of keys.
	 * @default 1
	 */
	rows: 1 | 2

	/**
	 * Determines the priority of the note triggers. Priority only takes effect when
	 * the number of keys being pressed down exceeds the polyphony (e.g. when the polyphony
	 * is 1 but a second key is pressed).
	 * - "last": prefer the last note(s) pressed
	 * - "first": prefer the first note(s) pressed
	 * - "highest": prefer the highest note(s) pressed
	 * - "lowest": prefer the lowest note(s) pressed
	 * For more on note priority, check out this {@link https://web.archive.org/web/20150913012148/http://www.soundonsound.com/sos/oct00/articles/synthsec.htm Sound on Sound article}.
	 * @default "last"
	 */
	priority: 'last' | 'first' | 'highest' | 'lowest'

	/**
	 * Determines what note the lowest key on the keyboard will represent.
	 * @default 60
	 * @remarks Keep in mind that setting it to a note other than `C` (`36`, `48`, `60`, `72`, `84`, etc.)
	 * will result in the key mappings not lining up like a regular keyboard!
	 */
	rootNote: number

	/**
	 * Determines whether or not the Z and X keys change the octaves when rows is set to 1.
	 */
	octaveControls: boolean

	/**
	 * The current / default octave.
	 */
	octave: number

	/**
	 * Determines whether or not the number keys set the velocity of the notes being triggered.
	 * Keep in mind that velocity is just a number— you have to interpret it in your sounds!
	 * @default true
	 */
	velocityControls: boolean

	/**
	 * Optional default note intensity.
	 */
	velocity: number

	/**
	 * A map of keyboard keys to midi notes.
	 */
	keymap?: Keymap

	/**
	 * A map of keyboard number keys to velocity amounts. `[1, 2 ... 9, 0]` maps to `[0 ... 127]`
	 */
	specialKeymap?: SpecialKeymap

	/**
	 * The width of the keyboard.
	 * @default 600
	 */
	width: number

	/**
	 * The height of the keyboard.
	 * @default 200
	 */
	height: number

	/**
	 * Whether or not event listeners should be added to the windows keyboard events automatically.
	 * @default true
	 **/
	eventListeners: boolean
}

export interface State extends KeyboardOptions {
	/**
	 * Array of notes currently being pressed down.
	 */
	keys: Note[]

	/**
	 * Array of notes currently being played
	 */
	buffer: Note[]
}
