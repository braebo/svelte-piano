// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Keymap, SpecialKeymap } from './types/Keymap'

/**
 * The map of each key to its corresponding note for
 * the a single-row layout.
 */
export const keymapSingle: Keymap = {
    KeyA: 	      { key: 'A',  color: 'white',  midi: 60,  name: 'C2', },
    KeyW: 	      { key: 'W',  color: 'black',  midi: 61,  name: 'C#2',},
    KeyS: 	      { key: 'S',  color: 'white',  midi: 62,  name: 'D2', },
    KeyE: 	      { key: 'E',  color: 'black',  midi: 63,  name: 'D#2',},
    KeyD: 	      { key: 'D',  color: 'white',  midi: 64,  name: 'E2', },
    KeyF: 	      { key: 'F',  color: 'white',  midi: 65,  name: 'F2', },
    KeyT: 	      { key: 'T',  color: 'black',  midi: 66,  name: 'F#2',},
    KeyG: 	      { key: 'G',  color: 'white',  midi: 67,  name: 'G2', },
    KeyY: 	      { key: 'Y',  color: 'black',  midi: 68,  name: 'G#2',},
    KeyH: 	      { key: 'H',  color: 'white',  midi: 69,  name: 'A2', },
    KeyU: 	      { key: 'U',  color: 'black',  midi: 70,  name: 'A#2',},
    KeyJ: 	      { key: 'J',  color: 'white',  midi: 71,  name: 'B2', },
    KeyK: 	      { key: 'K',  color: 'white',  midi: 72,  name: 'C3', },
    KeyO: 	      { key: 'O',  color: 'black',  midi: 73,  name: 'C#3',},
    KeyL: 	      { key: 'L',  color: 'white',  midi: 74,  name: 'D3', },
    KeyP: 	      { key: 'P',  color: 'black',  midi: 75,  name: 'D#3',},
    Semicolon:    { key: ';',  color: 'white',  midi: 76,  name: 'E3', },
    Quote:	      { key: '"',  color: 'white',  midi: 77,  name: 'F3', },
}

/**
 * The map of each keyboard code to its corresponding
 * piano note for a two-row layout.
 */
export const keymapDouble: Keymap = {
    // Bottom row starting with `Z`.
    KeyZ:         { key: 'Z',  color: 'white',  midi: 60,  name: 'C1',  },
    KeyS:         { key: 'S',  color: 'black',  midi: 61,  name: 'C#1', },
    KeyX:         { key: 'X',  color: 'white',  midi: 62,  name: 'D1',  },
    KeyD:         { key: 'D',  color: 'black',  midi: 63,  name: 'D#1', },
    KeyC:         { key: 'C',  color: 'white',  midi: 64,  name: 'E1',  },
    KeyV:         { key: 'V',  color: 'white',  midi: 65,  name: 'F1',  },
    KeyG:         { key: 'G',  color: 'black',  midi: 66,  name: 'F#1', },
    KeyB:         { key: 'B',  color: 'white',  midi: 67,  name: 'G1',  },
    KeyH:         { key: 'H',  color: 'black',  midi: 68,  name: 'G#1', },
    KeyN:         { key: 'N',  color: 'white',  midi: 69,  name: 'A1',  },
    KeyJ:         { key: 'J',  color: 'black',  midi: 70,  name: 'A#1', },
    KeyM:         { key: 'M',  color: 'white',  midi: 71,  name: 'B1',  },
    Comma:        { key: ',',  color: 'white',  midi: 72,  name: 'C1',  },
    KeyL:         { key: 'L',  color: 'black',  midi: 73,  name: 'C#1', },
    Period:       { key: '.',  color: 'white',  midi: 74,  name: 'D1',  },
    Semicolon:    { key: ';',  color: 'black',  midi: 75,  name: 'D#1', },
    Slash:        { key: '/',  color: 'white',  midi: 76,  name: 'E1',  },

    // Top row starting with `Q`.
    KeyQ:         { key: 'Q',  color: 'white',  midi: 72,  name: 'C2',  },
    Digit2:       { key: '2',  color: 'black',  midi: 73,  name: 'C#2', },
    KeyW:         { key: 'W',  color: 'white',  midi: 74,  name: 'D2',  },
    Digit3:       { key: '3',  color: 'black',  midi: 75,  name: 'D#2', },
    KeyE:         { key: 'E',  color: 'white',  midi: 76,  name: 'E2',  },
    KeyR:         { key: 'R',  color: 'white',  midi: 77,  name: 'F2',  },
    Digit5:       { key: '5',  color: 'black',  midi: 78,  name: 'F#2', },
    KeyT:         { key: 'T',  color: 'white',  midi: 79,  name: 'G2',  },
    Digit6:       { key: '6',  color: 'black',  midi: 80,  name: 'G#2', },
    KeyY: 	      { key: 'Y',  color: 'white',  midi: 81,  name: 'A2',  },
    Digit7:       { key: '7',  color: 'black',  midi: 82,  name: 'A#2', },
    KeyU: 	      { key: 'U',  color: 'white',  midi: 83,  name: 'B2',  },
    KeyI: 	      { key: 'I',  color: 'white',  midi: 84,  name: 'C2',  },
    Digit9:       { key: '9',  color: 'black',  midi: 85,  name: 'C#2', },
    KeyO: 	      { key: 'O',  color: 'white',  midi: 86,  name: 'D2',  },
    Digit0:       { key: '0',  color: 'black',  midi: 87,  name: 'D#2', },
    KeyP: 	      { key: 'P',  color: 'white',  midi: 88,  name: 'E2',  },
    BracketLeft:  { key: '[',  color: 'white',  midi: 89,  name: 'F2',  },
    Equal:        { key: '=',  color: 'black',  midi: 90,  name: 'F#2', },
    BracketRight: { key: ']',  color: 'white',  midi: 91,  name: 'G2',  },
} as const

/**
 * Maps Z and X to octave up and down, respectively, and
 * maps numbers 1-9 and 0 to velocity 1-127.
 */
export const specialKeyMap: SpecialKeymap = {
    // Octaves
    KeyZ:         { value: -1,  type: 'octave'   },
    KeyX:         { value: 1,   type: 'octave'   },

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
