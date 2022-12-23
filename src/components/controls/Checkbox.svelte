<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Check, X } from 'lucide-svelte'
	import { mobile } from 'fractils'

	const dispatch = createEventDispatcher()

	export let value: boolean
	const size = 20

	const handleClick = (state: boolean) => {
		value = state
		dispatch('input', { value: state })
	}
</script>

<div class="control">
	<div class="inputs">
		<div class="checkbox">
			<button class="unchecked" on:click={() => handleClick(false)} class:active={!value}>
				<X color="currentColor" strokeWidth={1} {size} />
			</button>
			<button class="checked" on:click={() => handleClick(true)} class:active={value}>
				<Check color="currentColor" strokeWidth={1} {size} />
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	.checkbox {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		background: var(--light-b);
		border-radius: var(--radius-sm);

		overflow: hidden;

		button {
			all: unset;
			display: flex;
			align-items: center;
			justify-content: center;

			width: 50%;

			color: var(--light-b);
			transition: 0.1s;
			&.active,
			&:hover {
				color: var(--brand-a);
				background: var(--light-c);
			}

			cursor: pointer;
		}

		.checked {
			border-left: 1px solid var(--light-d);
		}

		.unchecked {
			border-right: 1px solid var(--light-d);
		}
	}
</style>
