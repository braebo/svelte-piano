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
	import { mapRange } from 'fractils'
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

	// Used to store the last value of the slider before it's truncated.
	let targetValue = value

	/**
	 * Used to calculate progress when clicking the track (as opposed to dragging the thumb).
	 */
	const setFromMouse = (e: MouseEvent) => {
		if (!el) return
		// const mouse = vertical ? e.clientY : e.clientX
		const mouse = e.clientX
		const { left } = el.getBoundingClientRect()
		const relativeX = mouse - left

		const normalizedProgress = mapRange(relativeX, 0, el.clientWidth, 0, 100)

		targetValue = mapRange(normalizedProgress, 0, 100, min, max)
		updateValue(targetValue)

		// Continue in case this is a drag operation
		mouseDown()
	}

	const mouseUp = () => {
		dragging = false

		window?.addEventListener('mousemove', mouseMove)

		el.style.cursor = 'pointer'
		track.style.cursor = 'pointer'
		thumb.style.cursor = 'grab'
	}

	const mouseDown = () => {
		dragging = true

		window?.addEventListener('mouseup', mouseUp, { once: true })
		window?.addEventListener('mousemove', mouseMove)

		el.style.cursor = 'grabbing'
		if (el.parentElement) el.parentElement.style.cursor = 'grabbing'
		track.style.cursor = 'grabbing'
		thumb.style.cursor = 'grabbing'
	}

	const { performance } = globalThis
	let last = performance.now()
	const mouseMove = async (e: MouseEvent) => {
		if (!dragging || !el) return
		await tick()
		e.preventDefault()

		targetValue += e.movementX * ((1 / clientWidth) * (max - min))

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
		window?.removeEventListener('mousemove', mouseMove)
		window?.removeEventListener('mouseup', mouseUp)
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
		on:mousedown={setFromMouse}
		style:--thumb-width="{thumbWidth}px"
	>
		<div class="thumb" bind:this={thumb} on:mousedown|stopPropagation|capture={mouseDown} style:left="{progress}px" draggable="false" />
		<div class="track" bind:this={track} style:clip-path="0 {progress} 0 0" draggable="false" />
	</div>
{/if}

<style lang="scss">
	.range {
		position: relative;
		display: flex;

		width: 100%;

		background: none;

		user-select: none;

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
