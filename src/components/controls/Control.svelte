<script lang="ts">
	import { fly } from 'svelte/transition'
	import { mobile } from 'fractils'

	export let label = ''
	export let i = 1
</script>

<div class="control" in:fly={{ y: 10, duration: 300, delay: 100 + 33 * i }} out:fly={{ y: 10, duration: 100 }}>
	{#if label}<label for={label}>{label}</label>{/if}
	<div class="range" class:fullWidth={label} class:mobile={$mobile}>
		<slot />
	</div>
</div>

<style lang="scss">
	.control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		height: 2.5rem;
		width: var(--width, 100%);
		max-width: 100%;
		padding: 2px 15px;
		margin: auto;

		border: 1px solid rgba(var(--light-d-rgb), 0.33);
		background: rgba(var(--light-a-rgb), 0.5);
		box-shadow: var(--shadow-sm);
		border-radius: var(--radius);

		font-size: var(--font-xxs);

		pointer-events: all;
		user-select: none;

		label {
			position: relative;
			display: flex;
			align-items: center;

			color: var(--dark-d);

			height: 100%;
			width: 25%;
			margin: auto 0;

			text-transform: lowercase;
			letter-spacing: 1px;

			transition: 0.15s;
		}

		&:hover label {
			color: var(--dark-a);
		}
	}

	.range {
		width: 100%;
		padding: 18px 0;
	}
	.range.fullWidth {
		width: 80%;
	}
	.range.mobile {
		width: 60%;
	}
</style>
