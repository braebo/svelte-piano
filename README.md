<img src="https://raw.github.com/kylestetz/QwertyKeyboard/master/QwertyKeyboard.jpg" />

# QwertyKeyboard

A Typescript fork of [QwertyKeyboard](https://github.com/kylestetz/QwertyKeyboard/)

#### Bring your own sound.

Use QwertyKeyboard to power the QWERTY keyboard in your next Web Audio project. QwertyKeyboard provides **intelligent handling of key events**, giving you key up and key down events that you can use to trigger your sounds.

QwertyKeyboard provides **configurable polyphony**— if you're making a monophonic synth, choose from the common note priorities "last note", "first note", "highest note", or "lowest note". It also handles odd situations like switching tabs— QwertyKeyboard fires a note off event when your browser window goes out of focus.

Choose from two common key layouts, one of which supports optional octave shifting and velocity selecting.

<img src="https://raw.github.com/kylestetz/QwertyKeyboard/master/images/QwertyKeyboard-mapping-rows1.jpg" />

<img src="https://raw.github.com/kylestetz/QwertyKeyboard/master/images/QwertyKeyboard-mapping-rows2.jpg" />

# Installation

#### Using `pnpm`

```bash
$ pnpm i -D fractalhq/qwerty-keyboard
```
---

# Usage

```typescript
const keyboard = new QwertyKeyboard();

const keyboard = new QwertyKeyboard();

keyboard.down((note) => {
  // do stuff
});

keyboard.up((note) => {
  // do stuff
});
```

The `Note` interface:

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

These properties will be useful in setting up oscillators. See the [`test/index.html`](https://github.com/kylestetz/QwertyKeyboard/blob/master/test/index.html) file for a simple example.

### API

There are several options that can be set to configure your keyboard object. They can be passed into the `QwertyKeyboard` constructor in an object or set individually using `set`.

```javascript
// properties can be passed into the QwertyKeyboard object
const keyboard = new QwertyKeyboard({
  polyphony: 1,
  rows: 2,
  priority: 'lowest'
});

// all properties can also be set later
keyboard.priority = 'highest'
```

### `polyphony`
The number of keys that can be active simultaneously.

### `rows`
Either `1` or `2`, see the diagrams above.

### `octaveControls`
Determines whether or not the `z` and `x` keys shift octaves when `rows` is set to `1`.

### `velocityControls`
Determines whether or not the number keys set the velocity of the notes being triggered. Keep in mind that velocity is just a number— you have to interpret it in your sounds!

### `priority`
Determines the priority of the note triggers. Priority only takes effect when the number of keys being pressed down exceeds the polyphony (e.g. when the polyphony is 1 but a second key is pressed).

- `"last"`: prefer the last note(s) pressed
- `"first"`: prefer the first note(s) pressed
- `"highest"`: prefer the highest note(s) pressed
- `"lowest"`: prefer the lowest note(s) pressed

For more on note priority, check out [this Sound on Sound article](https://web.archive.org/web/20150913012148/http://www.soundonsound.com/sos/oct00/articles/synthsec.htm).

### `rootNote`
Determines what note the lowest key on the keyboard will represent. The default is `60` (C4). Keep in mind that setting it to a note other than C (36, 48, 60, 72, 84, etc.) will result in the key mappings not lining up like a regular keyboard!
