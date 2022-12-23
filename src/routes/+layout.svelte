<script lang="ts">
	import { ThemeToggle } from 'fractils'
	import Nav from '$components/Nav.svelte'
	import 'greset/greset.css'
	import '../styles/app.scss'
</script>

<template lang="pug">

	header
		.top
			h1 Qwerty Keyboard
		
			.theme-toggle
				
				ThemeToggle

		Nav

</template>

<slot />

<style lang="scss">
	header {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;

		padding: 1rem;

		color: var(--light-c);

		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;

			width: 100%;

			h1 {
				font-size: var(--font-lg);
				font-variation-settings: 'wght' 400;
				color: var(--dark-d);
			}
		}
	}

	.theme-toggle {
		filter: saturate(0) brightness(0.75);
	}
</style>
