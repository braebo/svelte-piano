<script lang="ts">
	import { Fractils, ThemeToggle } from 'fractils'
	import Github from '$components/Github.svelte'
	import Nav from '$components/Nav.svelte'
	import 'greset/greset.css'
	import '../styles/app.scss'
</script>

<template lang="pug">

	Fractils

	header
		.top
			h1 Svelte Piano
		
			.corner
				a(href="https://github.com/fractalhq/svelte-piano").github
					Github
				
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

	.corner {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.github {
		width: 1.5rem;
		height: 1.5rem;
		color: var(--dark-a);
		opacity: 0.5;
		transition: 0.1s;
		cursor: pointer;

		&:hover {
			opacity: 1;
		}
	}

	.theme-toggle {
		filter: saturate(0) brightness(0.75);
	}
</style>
