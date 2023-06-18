// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { KeyboardOptions, State, Note, Keymap, SpecialKey, SpecialKeymap, Key } from './types'

import { keymapSingle, keymapDouble, specialKeyMap } from './keymap'
import { atom } from 'nanostores'
import { Subject } from 'rxjs'

const keyDown = new Subject<Note>()
const keyUp = new Subject<Note>()
const specialKey = new Subject<SpecialKey>()

export const onKeyDown = keyDown.asObservable()
export const onKeyUp = keyUp.asObservable()
export const onSpecialKey = specialKey.asObservable()

export const activeKeys = atom<Note[]>([])

export class QwertyKeyboard {
	state: State

	private _rows: 1 | 2 = 1

	/**
	 * How many octaves to display.
	 */
	get rows() {
		return this._rows
	}

	set rows(rows: 1 | 2) {
		this._rows = rows
		this.keys = rows === 1 ? keymapSingle : keymapDouble
	}

	/**
	 * A map of the computer keyboard keys to their corresponding piano {@link Key Keys}.
	 */
	_keymap!: Keymap

	get keys() {
		return this._keymap
	}

	set keys(keys: Keymap) {
		this._keymap = keys
		this.whiteKeys = Object.fromEntries(Object.entries(keys).filter(([, key]) => key.color === 'white'))
		this.blackKeys = Object.fromEntries(Object.entries(keys).filter(([, key]) => key.color === 'black'))
	}

	/**
	 * All white keys in the keys.
	 */
	whiteKeys!: Keymap

	/**
	 * All the black keys in the keys.
	 */
	blackKeys!: Keymap

	/**
	 * Maps Z and X to octave up and down, respectively, and
	 * maps numbers 1-9 and 0 to velocity 1-127.
	 */
	specialKeyMap: SpecialKeymap

	/**
	 * An observable that emits the current {@link Note} being pressed.
	 */
	onKeyDown? = onKeyDown

	/**
	 * An observable that emits the current {@link Note} being released.
	 */
	onKeyUp? = onKeyUp

	/** Internal rxjs keyDown Subject */
	private keyDown = keyDown

	/** Internal rxjs keyUp Subject */
	private keyUp = keyUp

	constructor(options?: Partial<KeyboardOptions>) {
		const settings = Object.assign(QwertyKeyboard.defaultState(), options ?? {})

		this.state = settings

		this.rows = settings.rows

		this.keys = settings.rows === 1 ? keymapSingle : keymapDouble

		this.specialKeyMap = settings.specialKeymap ?? specialKeyMap

		if (settings.eventListeners) this.addListeners()
	}

	//*=======================
	//*        Options
	//*=======================

	static defaultState(): State {
		return {
			polyphony: 10,
			rows: 1,
			priority: 'last',
			rootNote: 60,
			octaveControls: true,
			octave: 0,
			velocityControls: true,
			velocity: 127,
			keys: [],
			buffer: [],
			width: 800,
			height: 200,
			eventListeners: true,
		}
	}

	/*
	 *	DOM Bindings
	 */

	protected keypressActive = false
	keypress(e: KeyboardEvent) {
		if (e.repeat) return
		this.addKey(e.code)
	}
	protected keyupActive = false
	keyup(e: KeyboardEvent) {
		this.removeKey(e.code)
	}
	protected blurActive = false
	blur() {
		this.clear()
	}

	protected addListeners() {
		if (typeof window !== 'undefined' && window.document) {
			if (!this.keypressActive) {
				window.addEventListener('keypress', this.keypress.bind(this))
				this.keypressActive = true
			}
			if (!this.keyupActive) {
				window.addEventListener('keyup', this.keyup.bind(this))
				this.keyupActive = true
			}
			if (!this.blurActive) {
				window.addEventListener('blur', this.blur.bind(this))
				this.blurActive = true
			}
		}
	}

	dispose() {
		if (typeof window !== 'undefined' && window.document) {
			window.removeEventListener('keypress', this.keypress.bind(this))
			window.removeEventListener('keyup', this.keyup.bind(this))
			window.removeEventListener('blur', this.blur.bind(this))
		}
		this.onKeyDown = undefined
		this.onKeyUp = undefined
	}

	//*=======================
	//*        Mapping
	//*=======================

	private get root() {
		return this.rows === 1 ? 'KeyA' : 'KeyZ'
	}

	/** `map` returns the midi note for a given keyCode.  */
	private getMidiNote(keyCode: KeyboardEvent['code']) {
		return this.keys[keyCode].midi + this.offset()
	}

	private offset() {
		return this.state.rootNote - this.keys[this.root].midi + this.state.octave * 12
	}

	/** `isNote` determines whether a keyCode is a note or not. */
	private isNote(keyCode: KeyboardEvent['code']) {
		return !!this.keys[keyCode]
	}

	/**
	 * Convert a midi note to a frequency. We assume that `map` has
	 * already been called (to account for a potential rootNote offset)
	 */
	private toFrequency(note: number) {
		return Math.pow(2, (note - 69) / 12) * 440.0
	}

	//*=======================
	//*        Buffer
	//*=======================

	press(code: KeyboardEvent['code']) {
		this.addKey(code)
	}

	release(code: KeyboardEvent['code']) {
		this.removeKey(code)
	}

	/**
	 * Creates a {@link Note} object from a keyboard event.
	 */
	private addKey(code: KeyboardEvent['code']) {
		// If the keyCode is one that can be mapped and isn't
		// Already pressed, add it to the key object.
		if (this.isNote(code) && !this.isPressed(code)) {
			const newKey = this.makeNote(code)
			// Add the newKey to the list of keys
			this.state.keys = (this.state.keys || []).concat(newKey)
			// Reevaluate the active notes based on our priority rules.
			// Give it the new note to use if there is an event to trigger.
			this.update()
		} else if (this.isSpecialKey(code)) {
			this.specialKey(code)
		}
	}

	private removeKey(code: KeyboardEvent['code']) {
		// If the keyCode is active, remove it from the key object.
		if (this.isPressed(code)) {
			let keyToRemove = {} as Note

			for (let i = 0; i < this.state.keys.length; i++) {
				if (this.state.keys[i].code === code) {
					keyToRemove = this.state.keys[i]
					break
				}
			}

			if (!keyToRemove) return

			// Remove the key from keys
			this.state.keys.splice(this.state.keys.indexOf(keyToRemove), 1)
			this.update()
		}
	}

	private isPressed(keyCode: KeyboardEvent['code']) {
		if (!this.state.keys || !this.state.keys.length) {
			return false
		}

		for (let i = 0; i < this.state.keys.length; i++) {
			if (this.state.keys[i].code === keyCode) {
				return true
			}
		}
		return false
	}

	// Turn a key object into a note object for the event listeners.
	private makeNote(keyCode: KeyboardEvent['code']): Note {
		return {
			code: keyCode,
			note: this.getMidiNote(keyCode),
			name: this.keys[keyCode].name,
			frequency: this.toFrequency(this.getMidiNote(keyCode)),
			velocity: this.state.velocity,
			isActive: false,
		}
	}

	/**
	 * Releases all active notes.
	 */
	clear() {
		// Trigger note off for the notes in the buffer before
		// removing them.
		this.state.buffer.forEach((key) => {
			// Note up events should have a velocity of 0.
			key.velocity = 0
			this.keyUp.next(key)
		})
		this.state.keys = []
		this.state.buffer = []
		activeKeys.set([])
	}

	//*=======================
	//*      Note Buffer
	//*=======================

	// Every time a change is made to keys due to a key on or key off
	// we need to call `update`.

	/**
	 * Compares the `keys` array to the `buffer` array
	 * which is the , makes the necessary changes to `buffer` and
	 * triggers any events that need triggering.
	 */
	private update() {
		// A key has been added to this.state.keys.
		// Stash the old buffer.
		const oldBuffer = this.state.buffer
		// Set the new priority in this.state.keys.
		this.prioritize()
		// Compare the buffers and trigger events based on
		// the differences.
		this.diff(oldBuffer)

		setTimeout(() => activeKeys.set(this.state.keys.filter((k) => k.isActive)), 0)
	}

	private diff(oldBuffer: Note[]) {
		// If it's not in the OLD buffer, it's a note ON.
		// If it's not in the NEW buffer, it's a note OFF.

		const oldNotes = oldBuffer.map((key) => key.code)

		const newNotes = this.state.buffer.map((key) => key.code)

		// Check for old (removed) notes.
		const notesToRemove: KeyboardEvent['code'][] = []

		oldNotes.forEach((key) => {
			if (newNotes.indexOf(key) === -1) {
				notesToRemove.push(key)
			}
		})

		// Check for new notes.
		const notesToAdd: KeyboardEvent['code'][] = []

		newNotes.forEach((key) => {
			if (oldNotes.indexOf(key) === -1) {
				notesToAdd.push(key)
			}
		})

		notesToAdd.forEach((key) => {
			for (let i = 0; i < this.state.buffer.length; i++) {
				if (this.state.buffer[i].code === key) {
					this.keyDown.next(this.state.buffer[i])
					break
				}
			}
		})

		notesToRemove.forEach((key) => {
			// These need to fire the entire object.
			for (let i = 0; i < oldBuffer.length; i++) {
				if (oldBuffer[i].code === key) {
					// Note up events should have a velocity of 0.
					oldBuffer[i].velocity = 0
					this.keyUp.next(oldBuffer[i])
					break
				}
			}
		})
	}

	//*=======================
	//*       Priority
	//*=======================

	private prioritize() {
		// If all the keys have been turned off, no need
		// to do anything here.
		if (!this.state.keys.length) {
			this.state.buffer = []
			return
		}

		if (this.state.polyphony >= this.state.keys.length) {
			// Set all keys to active.
			this.state.keys.forEach((key) => (key.isActive = true))
		} else {
			// Set all keys to inactive.
			this.state.keys.forEach((key) => (key.isActive = false))

			this[this.state.priority]()
		}

		// Set the buffer to all active keys.
		this.state.buffer = this.state.keys.filter((key) => key.isActive)
	}

	/**
	 * Sets the last bunch to active based on the polyphony.
	 */
	private last() {
		for (let i = this.state.keys.length - this.state.polyphony; i < this.state.keys.length; i++) {
			console.log(this.state.keys)
			this.state.keys[i].isActive = true
		}
	}

	/**
	 * Sets the last bunch to active based on the polyphony.
	 */
	first() {
		for (let i = 0; i < this.state.polyphony; i++) {
			this.state.keys[i].isActive = true
		}
	}

	/**
	 * Get the highest notes and set them to active
	 */
	highest() {
		const notes = this.state.keys.map((key) => {
			return key.note
		})

		notes.sort((b, a) => {
			if (a === b) {
				return 0
			}
			return a < b ? -1 : 1
		})

		notes.splice(this.state.polyphony, Infinity)

		this.state.keys.forEach((key) => {
			if (notes.indexOf(key.note) !== -1) {
				key.isActive = true
			}
		})
	}

	/**
	 * Get the lowest notes and set them to active
	 */
	lowest() {
		const notes = this.state.keys.map((key) => {
			return key.note
		})

		notes.sort((a, b) => {
			if (a === b) {
				return 0
			}
			return a < b ? -1 : 1
		})

		notes.splice(this.state.polyphony, Infinity)

		this.state.keys.forEach((key) => {
			if (notes.indexOf(key.note) !== -1) {
				key.isActive = true
			}
		})
	}

	//*=======================
	//*       Special
	//*=======================

	private isSpecialKey(keyCode: KeyboardEvent['code']) {
		return this.state.rows === 1 && this.specialKeyMap[keyCode]
	}

	private specialKey(keyCode: KeyboardEvent['code']) {
		if (this.specialKeyMap[keyCode].type === 'octave' && this.state.octaveControls) {
			// Shift the state of the `octave`.
			let targetOctave = this.state.octave + this.specialKeyMap[keyCode].value
			if (targetOctave > 4) targetOctave = 4
			if (targetOctave < -4) targetOctave = -4
			this.state.octave = targetOctave
		} else if (this.specialKeyMap[keyCode].type === 'velocity' && this.state.velocityControls) {
			// Set the `velocity` to a new value.
			this.state.velocity = this.specialKeyMap[keyCode].value
		}
		specialKey.next(this.specialKeyMap[keyCode])
	}
}
