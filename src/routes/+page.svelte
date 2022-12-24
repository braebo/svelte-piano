<script lang="ts">
	import KeyboardEditor from '$components/KeyboardEditor.svelte'
	import SpecialKeys from '$components/SpecialKeys.svelte'
	import Install from '$components/Install.svelte'
	import Code from '$components/Code.svelte'
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
	}
</style>
