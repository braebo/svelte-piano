export interface Note {
	/**
	 * The keyCode of the key being pressed down.
	 */
	code: KeyboardEvent['code']

	/**
	 * The midi number of the note.
	 */
	note: number

	/**
	 * The note name.
	 */
	name: string

	/**
	 * The frequency of the note between 0 and 20,000.
	 */
	frequency: number

	/**
	 * On note down, the current velocity.
	 * On note up, 0.
	 */
	velocity: number

	/**
	 * Whether the key is currently being pressed down.
	 */
	isActive: boolean
}
