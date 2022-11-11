// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Keymap, SpecialKeymap } from './types/Keymap'

/**
 * The map of each key to its corresponding note for
 * the a single-row layout.
 */
export const keymapSingle: Keymap = {
    KeyA: 	      { name: 'C',   note: 60,  color: 'white' },
    KeyW: 	      { name: 'C#',  note: 61,  color: 'black' },
    KeyS: 	      { name: 'D',   note: 62,  color: 'white' },
    KeyE: 	      { name: 'D#',  note: 63,  color: 'black' },
    KeyD: 	      { name: 'E',   note: 64,  color: 'white' },
    KeyF: 	      { name: 'F',   note: 65,  color: 'white' },
    KeyT: 	      { name: 'F#',  note: 66,  color: 'black' },
    KeyG: 	      { name: 'G',   note: 67,  color: 'white' },
    KeyY: 	      { name: 'G#',  note: 68,  color: 'black' },
    KeyH: 	      { name: 'A',   note: 69,  color: 'white' },
    KeyU: 	      { name: 'A#',  note: 70,  color: 'black' },
    KeyJ: 	      { name: 'B',   note: 71,  color: 'white' },
    KeyK: 	      { name: 'C2',  note: 72,  color: 'white' },
    KeyO: 	      { name: 'C#2', note: 73,  color: 'black' },
    KeyL: 	      { name: 'D2',  note: 74,  color: 'white' },
    KeyP: 	      { name: 'D#2', note: 75,  color: 'black' },
    Semicolon:    { name: 'E2',  note: 76,  color: 'white' },
    Quote:	      { name: 'F2',  note: 77,  color: 'white' },
}

/**
 * The map of each keyboard code to its corresponding
 * piano note for a two-row layout.
 */
export const keymapDouble = {
    // Bottom row starting with `Z`.
    KeyZ:         { name: 'C',   note: 60,  color: 'white' },
    KeyS:         { name: 'C#',  note: 61,  color: 'black' },
    KeyX:         { name: 'D',   note: 62,  color: 'white' },
    KeyD:         { name: 'D#',  note: 63,  color: 'black' },
    KeyC:         { name: 'E',   note: 64,  color: 'white' },
    KeyV:         { name: 'F',   note: 65,  color: 'white' },
    KeyG:         { name: 'F#',  note: 66,  color: 'black' },
    KeyB:         { name: 'G',   note: 67,  color: 'white' },
    KeyH:         { name: 'G#',  note: 68,  color: 'black' },
    KeyN:         { name: 'A',   note: 69,  color: 'white' },
    KeyJ:         { name: 'A#',  note: 70,  color: 'black' },
    KeyM:         { name: 'B',   note: 71,  color: 'white' },
    Comma:        { name: 'C',   note: 72,  color: 'white' },
    KeyL:         { name: 'C#',  note: 73,  color: 'black' },
    Period:       { name: 'D',   note: 74,  color: 'white' },
    Semicolon:    { name: 'D#',  note: 75,  color: 'black' },
    Slash:        { name: 'E',   note: 76,  color: 'white' },

    // Top row starting with `Q`.
    KeyQ:         { name: 'C',	 note: 72, 	color: 'white' },
    Digit2:       { name: 'C#',  note: 73, 	color: 'black' },
    KeyW:         { name: 'D',	 note: 74, 	color: 'white' },
    Digit3:       { name: 'D#',  note: 75, 	color: 'black' },
    KeyE:         { name: 'E',	 note: 76, 	color: 'white' },
    KeyR:         { name: 'F',	 note: 77, 	color: 'white' },
    Digit5:       { name: 'F#',  note: 78, 	color: 'black' },
    KeyT:         { name: 'G',	 note: 79, 	color: 'white' },
    Digit6:       { name: 'G#',  note: 80, 	color: 'black' },
    KeyY: 	      { name: 'A',	 note: 81, 	color: 'white' },
    Digit7:       { name: 'A#',  note: 82, 	color: 'black' },
    KeyU: 	      { name: 'B',	 note: 83, 	color: 'white' },
    KeyI: 	      { name: 'C',	 note: 84, 	color: 'white' },
    Digit9:       { name: 'C#',  note: 85, 	color: 'black' },
    KeyO: 	      { name: 'D',	 note: 86, 	color: 'white' },
    Digit0:       { name: 'D#',  note: 87, 	color: 'black' },
    KeyP: 	      { name: 'E',	 note: 88, 	color: 'white' },
    BracketLeft:  { name: 'F',	 note: 89, 	color: 'white' },
    Equal:        { name: 'F#',  note: 90, 	color: 'black' },
    BracketRight: { name: 'G',	 note: 91,  color: 'white' },
} as const

/**
 * Maps Z and X to octave up and down, respectively, and
 * maps numbers 1-9 and 0 to velocity 1-127.
 */
export const specialKeyMap: SpecialKeymap = {
    // Octaves
    KeyZ:         { value: -1,  type: 'octave' },
    KeyX:         { value: 1,   type: 'octave' },

    // Velocity
    Digit1:       { value: 1,   type: 'velocity' },
    Digit2:       { value: 14,  type: 'velocity' },
    Digit3:       { value: 28,  type: 'velocity' },
    Digit4:       { value: 42,  type: 'velocity' },
    Digit5:       { value: 56,  type: 'velocity' },
    Digit6:       { value: 70,  type: 'velocity' },
    Digit7:       { value: 84,  type: 'velocity' },
    Digit8:       { value: 98,  type: 'velocity' },
    Digit9:       { value: 112, type: 'velocity' },
    Digit0:       { value: 127, type: 'velocity' },
} as const
