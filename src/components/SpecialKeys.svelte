<script lang="ts">
	import { onSpecialKey, type QwertyKeyboard } from '$lib/QwertyKeyboard.js'
	import { controls } from '$lib/controls.js'
	import { onDestroy } from 'svelte'

	export let keyboard: QwertyKeyboard

	let upActive = false
	let downActive = false

	$: if ($onSpecialKey) {
		if ($onSpecialKey.type === 'octave') {
			if ($onSpecialKey.value === -1) {
				downActive = true
			} else if ($onSpecialKey.value === 1) {
				upActive = true
			}
			reset()
		}
	}

	function activateDown() {
		keyboard?.press('KeyZ')
		downActive = true
		reset()
	}

	function activateUp() {
		keyboard?.press('KeyX')
		upActive = true
		reset()
	}

	let timer: NodeJS.Timeout
	function reset() {
		clearTimeout(timer)
		timer = setTimeout(() => {
			upActive = false
			downActive = false
		}, 100)
	}

	onDestroy(() => {
		clearTimeout(timer)
	})
</script>

{#key $onSpecialKey}
	<section style:width="{$controls?.width.value}px">
		<div class="subsection octave">
			<div class="cells">
				{#each [-4, -3, -2, -1, 0, 1, 2, 3, 4] as octave}
					{@const active = keyboard?.state?.octave === octave}
					<div class="cell" class:active class:middle={octave === 0} />
				{/each}
			</div>

			<div class="content">
				<div class="title">Octave</div>

				<div class="br-sm" />

				<div class="keys">
					<div class="key z" on:pointerdown={activateDown} class:active={downActive}>Z</div>
					<div class="key x" on:pointerdown={activateUp} class:active={upActive}>X</div>
				</div>
			</div>
		</div>
	</section>
{/key}

<style lang="scss">
	section {
		position: relative;
		z-index: 1;
		user-select: none;
		pointer-events: none;

		transform: translateY(-1rem);
		max-width: 95vw;
	}

	.subsection {
		display: flex;
		align-items: center;
		text-align: center;
		gap: 1rem;

		width: fit-content;
		padding: 1rem 0.5rem;

		color: var(--dark-d);
	}

	.keys {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		gap: 1rem;

		width: 100%;
	}

	.key {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 2rem;
		height: 2rem;

		color: var(--light-a);
		background-color: var(--dark-a);
		border-radius: var(--radius-sm);
		box-shadow: 0 0 0.125rem 0.25rem rgba(var(--brand-a-rgb), 0.5) inset;
		filter: saturate(0);

		font-size: var(--font-md);
		font-weight: bold;

		cursor: pointer;
		pointer-events: all;
		transition: 0.2s;
		transform: scale(1);

		&.active {
			background-color: var(--brand-a);
			filter: saturate(1);
			transform: scale(0.9);
		}
	}

	.cells {
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		justify-content: space-between;
		gap: 0.1rem;

		height: 100%;
	}

	.cell {
		width: 0.4rem;
		height: 0.4rem;

		background: var(--light-d);
		border-radius: 0.1rem;

		font-size: 0.25rem;

		&.middle {
			background: var(--light-c);
		}

		&.active {
			background: var(--brand-a);
		}
	}
</style>
