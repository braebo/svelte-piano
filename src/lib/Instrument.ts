import type { QwertyKeyboard } from './QwertyKeyboard'
import type { Subscription } from 'rxjs'

import { Sampler, PingPongDelay, Reverb } from 'tone'
import { dev } from '$app/environment'
import { log } from 'fractils'

const salamander = {
	urls: {
		A0: 'A0.mp3',
		A1: 'A1.mp3',
		A2: 'A2.mp3',
		A3: 'A3.mp3',
		A4: 'A4.mp3',
		A5: 'A5.mp3',
		A6: 'A6.mp3',
		A7: 'A7.mp3',
		C1: 'C1.mp3',
		C2: 'C2.mp3',
		C3: 'C3.mp3',
		C4: 'C4.mp3',
		C5: 'C5.mp3',
		C6: 'C6.mp3',
		C7: 'C7.mp3',
		C8: 'C8.mp3',
		// Ds1: 'Ds1.mp3',
		// Ds2: 'Ds2.mp3',
		// Ds3: 'Ds3.mp3',
		// Ds4: 'Ds4.mp3',
		// Ds5: 'Ds5.mp3',
		// Ds6: 'Ds6.mp3',
		// Ds7: 'Ds7.mp3',
		// Fs1: 'Fs1.mp3',
		// Fs2: 'Fs2.mp3',
		// Fs3: 'Fs3.mp3',
		// Fs4: 'Fs4.mp3',
		// Fs5: 'Fs5.mp3',
		// Fs6: 'Fs6.mp3',
		// Fs7: 'Fs7.mp3',
	},
	baseUrl: 'https://tonejs.github.io/audio/salamander/',
}

const electric = {
	urls: {
		A1: 'A1.mp3',
		A2: 'A2.mp3',
		B1: 'B1.mp3',
		C2: 'C2.mp3',
		D2: 'D2.mp3',
		E2: 'E2.mp3',
		F2: 'F2.mp3',
		G2: 'G2.mp3',
		// As1: 'As1.mp3',
		// Cs2: 'Cs2.mp3',
		// Ds2: 'Ds2.mp3',
		// Fs2: 'Fs2.mp3',
		// Gs1: 'Gs1.mp3',
	},
	baseUrl: 'https://tonejs.github.io/audio/casio/',
}

const instruments = { salamander, electric }

export class Instrument {
	static count = 0

	selectedInstrument: keyof typeof instruments = 'electric'

	sampler = new Sampler({
		...Object.fromEntries(Object.entries(instruments[this.selectedInstrument])),
		onload: () => {
			this.sampler.volume.value = -6
			this.sampler.connect(this.pingpong)
			this.pingpong.connect(this.reverb)
			this.reverb.toDestination()
		},
	})

	keydown!: Subscription
	keyup!: Subscription

	pingpong = new PingPongDelay({
		wet: 0.1,
		delayTime: 0.25,
		feedback: 0.5,
	})

	reverb = new Reverb({
		wet: 0.3,
		decay: 10,
		preDelay: 0.01,
	})

	constructor(public keyboard: QwertyKeyboard) {
		Instrument.count++
		if (dev) log(`Instrument #${Instrument.count} Created`, 'lightgreen')

		if (this.keyboard.onKeyDown)
			this.keydown = this.keyboard.onKeyDown.subscribe((note) => {
				this.sampler.triggerAttack([note.name], '+0.01', note.velocity / 127)
			})

		if (this.keyboard.onKeyUp)
			this.keyup = this.keyboard.onKeyUp.subscribe((note) => {
				this.sampler.triggerRelease([note.name])
			})
	}

	dispose() {
		if (dev) log(`Instrument #${Instrument.count} Disposed`, 'orange')
		this.sampler.dispose()
		this.keydown.unsubscribe()
		this.keyup.unsubscribe()
		this.keyboard.dispose()
		Instrument.count--
	}
}
