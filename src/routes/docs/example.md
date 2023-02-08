# Svelte Piano

A typescript / svelte rewrite of the awesome [AudioKeys](https://github.com/kylestetz/AudioKeys) project.

From the original project:

> Use AudioKeys to power the QWERTY keyboard in your next Web Audio project. AudioKeys provides **intelligent handling of key events**, giving you key up and key down events that you can use to trigger your sounds.
>
> AudioKeys provides **configurable polyphony**— if you're making a monophonic synth, choose from the common note priorities "last note", "first note", "highest note", or "lowest note". It also handles odd situations like switching tabs— AudioKeys fires a note off event when your browser window goes out of focus.

<br>

## Installation

```bash
pnpm install -D svelte-piano
```

<br>

## Usage

```svelte
<script>
	import { Piano } from 'svelte-piano';
</script>

<Piano />
```

<br>

## Options


|             |                                                             |
|-------------|-------------------------------------------------------------|
| `polyphony` | The number of keys that can be active simultaneously.       |
| `notes`     | Whether or not to display the note names.  Default `false`. |
| `sound`     | Whether to load and play the stock keyboard sound.          |
| `width`     | Piano width in pixels.                                      |
| `height`    | Piano height in pixels.                                     |
| `theme`     | `todo`                                                      |

```svelte
<Piano
	options={
		polyphony: 1,
		notes: false,
		keys: true,
		sound: true
	}
	--width: 900px;
	--height: 250px;
 />
```

<br>

## Note events

You can subscribe to note events using the `onKeyDown`, `onKeyUp`, and `activeKeys` stores.

```svelte
<script>
	import { SveltePiano, onKeyDown, onKeyUp, activeKeys } from 'svelte-piano';

	$: console.log($activeKeys)

	$: $onKeyDown, () => {
		console.log($onKeyDown)
	}

	$: $onKeyUp, () => {
		console.log($onKeyUp)
	}
</script>

<Piano />
```

### The `Note` interface:

```typescript
interface Note {
	/**
	 * The keyCode of the key being pressed down.
	 */
	keyCode: number

	/**
	 * The midi number of the note.
	 */
	note: number

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
```

These properties will be useful in setting up instruments. See the [`lib/Instrument.ts`](https://github.com/fractalhq/svelte-piano/blob/main/src/lib/Instrument.ts) file for a simple example.

<br>

## Headless API

If you're not using Svelte, you can use the keyboard directly. Options can be passed into the `QwertyKeyboard` constructor in an object or set individually using `set`.

```ts
// Headless vanilla keyboard.
const keyboard = new QwertyKeyboard({
  polyphony: 1,
  rows: 2,
  priority: 'lowest'
});

// Properties can also be set later.
keyboard.priority = 'highest'
```

| Property           | Description                                                                                                                                                                                            |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `polyphony`        | The number of keys that can be active simultaneously.                                                                                                                                                  |
| `rows`             | Either `1` or `2`.                                                                                                                                                                                     |
| `octaveControls`   | Determines whether or not the `z` and `x` keys shift octaves when `rows` is set to `1`.                                                                                                                |
| `velocityControls` | Determines whether or not the number keys set the velocity of the notes being triggered.                                                                                                               |
| `priority`         | Determines the priority of the note triggers.                                                                                                                                                          |
|                    | `"last"`: prefer the last note(s) pressed. <br> `"first"`: prefer the first note(s) pressed. <br> `"highest"`: prefer the highest note(s) pressed. <br> `"lowest"`: prefer the lowest note(s) pressed. |
| `rootNote`         | Determines what note the lowest key on the keyboard will represent. The default is `60` (C4).                                                                                                          |

The default `rootNote` is `60` (C4). Keep in mind that setting it to a note other than C (36, 48, 60, 72, 84, etc.) will result in the key mappings not lining up like a regular keyboard!

For more on note priority, check out [this Sound on Sound article](https://web.archive.org/web/20150913012148/http://www.soundonsound.com/sos/oct00/articles/synthsec.htm).

