<!-- 
	@component
	A custom range input slider component.
	
	@prop `value: any` - The value to be controled by the slider.
	@prop `range: { min: number, max: number, step?: number }` - The range of the slider.
	@prop `name: string` - The name of the value for its label.
	@prop `vertical?: boolean` - The amount to increment each change.
	@prop `truncate?: boolean` - Rounds decimals into whole numbers. (same as step = 1)
	@prop `manual?: boolean` - Dispatches an event instead of updating the value directly.
 -->
<script lang="ts">
	import { tick, createEventDispatcher } from 'svelte'
	import { mapRange, mobile } from 'fractils'
	import { onDestroy } from 'svelte'

	const dispatch = createEventDispatcher()

	/** The value to be controled by the slider. */
	export let value: any
	export let name: string
	export let range: { min: number; max: number; step?: number }
	export let vertical = false
	export let truncate = false
	export let manual = true

	const { min, max } = range

	const step = range.step ?? 0.01

	let el: HTMLElement
	let track: HTMLElement
	let thumb: HTMLElement
	let dragging = false
	const thumbWidth = 8
	$: clientWidth = el?.clientWidth ?? 100
	$: progress = mapRange(value, min, max, 1, clientWidth - thumbWidth)
	$: console.log({ progress })

	// Used to store the last value of the slider before it's truncated.
	let targetValue = value

	let last = performance.now()

	interface Events {
		touch: boolean
		startEvent: 'pointerdown' | 'touchstart'
		endEvent: 'pointerup' | 'touchend'
		moveEvent: 'pointermove' | 'touchmove'
	}

	const getX = (e: MouseEvent | TouchEvent) => {
		if (e.type.includes('touch')) {
			return (e as TouchEvent).touches?.[0].clientX
		} else {
			return (e as MouseEvent).clientX
		}
	}

	let events: Events

	const getEvents = (e: TouchEvent | MouseEvent): Events => {
		if (e.type.includes('touch')) {
			events = {
				touch: true,
				startEvent: 'touchstart',
				endEvent: 'touchend',
				moveEvent: 'touchmove',
			}
		}

		events = {
			touch: false,
			startEvent: 'pointerdown',
			endEvent: 'pointerup',
			moveEvent: 'pointermove',
		}

		return events
	}

	/**
	 * Used to calculate progress when clicking the track (as opposed to dragging the thumb).
	 */
	const handleInput = (e: MouseEvent | TouchEvent) => {
		if (!el) return
		const targetValue = getTargetValue(e)
		updateValue(targetValue)

		const events = getEvents(e)

		// Continue in case this is a drag operation
		handleMoveStart(events)
	}

	const getTargetValue = (e: MouseEvent | TouchEvent) => {
		const x = getX(e)

		const { left } = el.getBoundingClientRect()
		const relativeX = x - left

		const normalizedProgress = mapRange(relativeX, 0, el.clientWidth, 0, 100)

		targetValue = mapRange(normalizedProgress, 0, 100, min, max)

		console.log({ normalizedProgress, min, max, targetValue })

		return targetValue
	}

	const handleInputEnd = (events: Events) => {
		dragging = false

		const { touch, moveEvent } = events
		window?.addEventListener(moveEvent, handleInputMove)

		if (!touch && el && track && thumb) {
			el.style.cursor = 'pointer'
			track.style.cursor = 'pointer'
			thumb.style.cursor = 'grab'
		}
	}

	const handleMoveStart = (events: Events) => {
		dragging = true

		const { touch, endEvent, moveEvent } = events

		window?.addEventListener(endEvent, () => handleInputEnd(events), { once: true })
		window?.addEventListener(moveEvent, handleInputMove)

		if (touch) {
			el.style.cursor = 'grabbing'
			if (el.parentElement) el.parentElement.style.cursor = 'grabbing'
			track.style.cursor = 'grabbing'
			thumb.style.cursor = 'grabbing'
		}
	}

	const handleInputMove = async (e: MouseEvent | TouchEvent) => {
		if (!dragging || !el) return
		await tick()

		targetValue = getTargetValue(e)

		if (targetValue < min) targetValue = min
		if (targetValue > max) targetValue = max

		const now = performance.now()
		if (now > last + 1) {
			updateValue(targetValue)
		}
		last = now
	}

	let cumulativeValue = 0
	const decimalCountInStep = step.toString().split('.')[1]?.length ?? 0
	const updateValue = (v: number) => {
		let newValue = v
		if (truncate) v = Math.round(v)
		if (Math.abs(targetValue - cumulativeValue) > step) {
			newValue = parseFloat(v.toFixed(decimalCountInStep))
			cumulativeValue = 0

			if (manual) dispatch('input', { value: newValue })
			else value = newValue
		} else cumulativeValue += v
	}

	onDestroy(() => {
		if (typeof window === 'undefined') return
		window?.removeEventListener('pointermove', handleInputMove)
		window?.removeEventListener('pointerup', () => handleInputEnd({} as Events))
	})
</script>

{#if value}
	<div
		role="slider"
		bind:this={el}
		class:vertical
		draggable="false"
		class="range {name}"
		aria-valuenow={value}
		on:mousedown={(e) => {
			if ($mobile) return
			handleInput(e)
		}}
		on:touchstart|preventDefault={(e) => {
			if (!$mobile) return
			handleInput(e)
		}}
		style:--thumb-width="{thumbWidth}px"
	>
		<!-- on:touchstart={setFromTouch} -->
		<div class="thumb" bind:this={thumb} style:left="{progress}px" draggable="false" />
		<!-- on:mousedown={handleInput}
			on:touchstart={handleInput} -->
		<div class="track" bind:this={track} style:clip-path="0 {progress} 0 0" draggable="false" />
	</div>
{/if}

<style lang="scss">
	.range {
		position: relative;
		display: flex;

		width: 100%;

		background: none;

		pointer-events: all;

		&:focus {
			outline: none;
		}
		&:hover .track {
			border-color: var(--light-d);
		}
	}

	.track {
		width: 100%;
		height: 15px;

		border: 0.2px solid var(--light-c);
		border-radius: 50px;
		background: var(--light-c);

		cursor: pointer;
		transition: 200ms;
	}

	.thumb {
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;

		width: var(--thumb-width);
		height: var(--thumb-height, 100%);

		border-radius: 5px;
		background-image: linear-gradient(to right, var(--light-c) 0%, var(--brand-a) 50%, var(--light-c) 100%);

		cursor: grab;
		transition: background 0.3s;

		&:focus::-webkit-slider-thumb {
			background: var(--brand-a);
		}
	}
</style>
