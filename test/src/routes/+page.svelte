<script lang="ts">
	import { Piano } from 'svelte-piano';

	type test = ConstructorParameters<typeof Piano>[0];
	// ^ all the types are "any" 😡
</script>

<Piano />
