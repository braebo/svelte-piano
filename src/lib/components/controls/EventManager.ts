type InputEvent = TouchEvent | MouseEvent

type ValidEvent = 'touchstart' | 'touchmove' | 'touchend' | 'mousedown' | 'mousemove' | 'mouseup'
interface EventMap {
	[key: string]: ValidEvent
	startEvent: 'touchstart' | 'mousedown'
	moveEvent: 'touchmove' | 'mousemove'
	endEvent: 'touchend' | 'mouseup'
}

export class XEvent {
	x: number
	y: number
	type: 'touch' | 'mouse'
	eventMap: EventMap

	constructor(event: InputEvent) {
		if (event instanceof TouchEvent) {
			this.x = event.touches[0].clientX
			this.y = event.touches[0].clientY
			this.type = 'touch'
			this.eventMap = {
				startEvent: 'touchstart',
				moveEvent: 'touchmove',
				endEvent: 'touchend',
			}
		} else {
			this.x = event.clientX
			this.y = event.clientY
			this.type = 'mouse'
			this.eventMap = {
				startEvent: 'mousedown',
				moveEvent: 'mousemove',
				endEvent: 'mouseup',
			}
		}
	}
}

export class XEvents {
	history: Array<XEvent> = []

	protected _lastEvent?: XEvent
	get lastEvent() {
		return this._lastEvent
	}
	set lastEvent(event: XEvent | undefined) {
		this._lastEvent = event
	}

	historyLimit = 10

	add(event: XEvent) {
		if (this.history.length > this.historyLimit) {
			this.history.shift()
		}
		this.history.push(event)
		this.lastEvent = event
	}

	isTouch() {
		return !!this.lastEvent?.type.includes('touch')
	}

	isMouse() {
		return !!this.lastEvent?.type.includes('mouse')
	}
}
