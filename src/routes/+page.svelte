<script lang="ts">
	import KeyboardEditor from '$lib/KeyboardEditor.svelte'
	import Install from '$lib/Install.svelte'
	import Code from '$lib/Code.svelte'
</script>

<template lang="pug">

	.page

		Install

		KeyboardEditor

		Code

</template>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}
</style>
