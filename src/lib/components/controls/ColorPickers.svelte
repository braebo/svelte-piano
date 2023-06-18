<script lang="ts">
	import { controls } from '$lib'
	import { mobile } from 'fractils'
</script>

<div class="control">
	<div class="inputs">
		<div class="colors">
			<input class:mobile={$mobile} type="color" bind:value={$controls.theme.value.a} />
			<input class:mobile={$mobile} type="color" bind:value={$controls.theme.value.b} />
		</div>
	</div>
</div>

<style lang="scss">
	.colors {
		display: flex;
		align-items: center;
		justify-content: space-around;

		width: 100%;
		height: 1.8rem;

		background: var(--light-b);
		border-radius: var(--radius-sm);

		overflow: hidden;

		input {
			all: unset;
			display: flex;
			align-items: center;

			width: 42%;
			height: 100%;

			color: var(--light-b);
			outline: none !important;
			border: none !important;
			border-radius: var(--radius);

			&::-webkit-color-swatch {
				border: none !important;
				outline: none !important;
				appearance: none !important;
				border-radius: var(--radius);
				box-shadow: var(--shadow-sm) inset;
			}

			transition: 0.1s;

			&:hover {
				color: var(--brand-a);
				background: var(--light-c);
			}

			cursor: pointer;

			&.mobile {
				width: 33%;
				height: 75%;
			}
		}
	}
</style>
