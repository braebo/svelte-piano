<script lang="ts">
	import KeyboardEditor from '$components/KeyboardEditor.svelte'
	import SpecialKeys from '$components/SpecialKeys.svelte'
	import Install from '$components/Install.svelte'
	import Code from '$components/Code.svelte'
	import { wait } from 'fractils'
</script>

<template lang="pug">

	.page

		Install

		+await('wait(250) then _')
			KeyboardEditor

		+await('wait(750) then _')
			Code

</template>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
