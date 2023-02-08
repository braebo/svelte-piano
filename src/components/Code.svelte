<script lang="ts">
	import { defaultControls } from '$lib/controls'
	import { draggable } from '@neodrag/svelte'
	import { mobile } from 'fractils'
	import Copy from './Copy.svelte'
	import { controls } from '$lib'

	const defaults = JSON.parse(JSON.stringify(defaultControls))

	$: options = Object.entries($controls).filter(([key]) => {
		if (['theme', 'width', 'height'].includes(key)) return false

		const isDefaultValue = $controls[key].value !== defaults[key].value

		return isDefaultValue
	})

	$: optionProps = options
		.map(
			([k, v]) => `\n\t&nbsp;&nbsp;<span class="options">${k}</span><span class="curlyboi">:</span><span class="value"> ${v.value}</span>`,
		)
		.join(',')

	$: styles = ['width', 'height'].filter((prop) => {
		return $controls[prop].value !== defaults[prop].value
	})

	$: styleProps = styles
		.map((prop) => {
			return `\n\t<span class="styleprop">--${prop}</span><span class="operator">=</span><span class="string">"${$controls[prop].value}px"</span>`
		})
		.join('')

	$: propLength = optionProps.length + styleProps.length

	let code = ''

	$: if ($controls) {
		code = `<span class="element">&lt;Piano</span>${
			optionProps.length
				? `\n\t<span class="options">options</span><span class="curlyboi">=\{</span>${optionProps}${
						optionProps.length ? '\n\t' : ''
				  }<span class="curlyboi">\}</span>`
				: ''
		}${styleProps}${propLength > 0 ? '\n' : ' '}<span class="element">\/\></span>`
	}
</script>

<pre use:draggable class:mobile={$mobile}><span
		><Copy {options} {styles}
			><span class="operator">{'<script>\n\t'}</span><span style:color="var(--brand-a)">import</span> <span class="curlyboi">&lcub;</span
			> <span class="element">Piano</span> <span class="curlyboi">&rcub;</span> <span class="operator">from</span> <span class="string"
				>'svelte-piano'</span
			><span class="operator">{'\n<' + 'script>\n\n'}</span>{@html code}</Copy
		></span
	></pre>

<style lang="scss">
	pre {
		position: fixed;
		inset: 0;
		top: unset;
		bottom: 20%;

		display: flex;

		z-index: 0;

		width: fit-content;
		margin: auto;
		padding: 1rem;

		font-size: var(--font-sm);
		background: rgba(var(--light-a-rgb), 0.9);
		color: var(--dark-d);
		border-radius: var(--radius);
		backdrop-filter: blur(10px);
		box-shadow: var(--shadow);

		cursor: grab;

		animation: screenOn 0.75s cubic-bezier(0.49, 0.05, 0.09, 1.02) forwards;

		&:active,
		&:focus {
			cursor: grabbing;
		}

		span {
			cursor: pointer;

			:global(.copy) {
				background-color: transparent;
				background: transparent;
			}
		}

		&.mobile {
			right: 1rem;
			bottom: 1rem;
			left: unset;

			user-select: none;

			span {
				font-size: 0.7rem !important;
			}
		}
	}

	@keyframes screenOn {
		0% {
			opacity: 0;
			clip-path: inset(50% 0 50% 0);
		}
		100% {
			opacity: 1;
			clip-path: inset(0);
		}
	}

	:global(.element) {
		color: rgb(239, 96, 43);
	}
	:global(.styleprop) {
		color: var(--brand-a);
	}
	:global(.operator) {
		color: rgb(51, 71, 88);
	}
	:global(.string) {
		color: rgb(176 171 96);
	}
	:global(.curlyboi) {
		color: rgb(51, 71, 88);
	}
	:global(.options) {
		color: var(--dark-d);
	}
	:global(.value) {
		color: rgb(152, 96, 176);
	}
</style>
