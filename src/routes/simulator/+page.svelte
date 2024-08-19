<script lang="ts">
	import Icon from '@iconify/svelte';
	import { useWebGazerLifecycle } from './hooks.client';
	import type { WebGazer, GazeData } from 'webgazer';

	let isTracking = true;
	let shouldAnimate = true;
	let webgazer: WebGazer;

	useWebGazerLifecycle(
		(data: GazeData | null, clock: number) => {
			console.log(data);
			console.log(clock);
		},
		() => {
			console.log('WebGazer component destroyed');
		}
	)
		.then((wg) => {
			console.log('WebGazer initialized');
			webgazer = wg;
		})
		.catch((error) => {
			console.error('Failed to initialize WebGazer:', error);
		});

	function toggleTracking() {
		if (webgazer) {
			if (isTracking) {
				webgazer.end();
			} else {
				webgazer.begin();
			}
			isTracking = !isTracking;
		} else {
			console.error('WebGazer is not initialized');
		}
	}

	function restartAnimation() {
		shouldAnimate = false;
		setTimeout(() => {
			shouldAnimate = true;
		}, 0);
	}
</script>

<svelte:head>
	<title>Simulator | ReLEx Trainer</title>
	<meta
		name="description"
		content="ReLEx SMILE Simulator: Keep your eye still during LASIK Surgery."
	/>
</svelte:head>

{#if shouldAnimate}
	<section class="flex h-screen">
		<div class="m-auto">
			<div class="outer-circle">
				<div class="inner-circle-1" />
				<div class="inner-circle-2" />
				<div class="blink">
					<div class="fixate-circle" />
				</div>
			</div>
		</div>
	</section>
{/if}

<footer class="fixed bottom-2 left-0 flex w-full justify-between px-2">
	<div>
		<a class="btn btn-square btn-neutral text-xl" href="/" role="button" title="Home">
			<Icon icon="mi:home" />
		</a>
	</div>
	<div class="flex space-x-2">
		<button
			class="btn btn-square btn-primary text-xl"
			on:click={toggleTracking}
			title={isTracking ? 'Turn off eye tracking' : 'Turn on eye tracking'}
		>
			{#if isTracking}
				<Icon icon="mi-eye-off" />
			{:else}
				<Icon icon="mi:eye" />
			{/if}
		</button>
		<button
			class="btn btn-square btn-secondary text-xl"
			on:click={restartAnimation}
			title="Restart"
		>
			<Icon icon="mi:refresh" />
		</button>
	</div>
</footer>

<style>
	:root {
		background-color: black !important;
	}

	.outer-circle {
		width: 500px;
		height: 500px;
		background-color: #404040;
		border-radius: 50%;
		position: relative;
	}

	.inner-circle-1 {
		width: 100%;
		height: 100%;
		background-color: #202020;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		animation:
			sweep-to-center 10s linear forwards,
			fade-in 0s linear forwards;
		animation-delay: 0s, 0s;
		opacity: 0;
	}

	.inner-circle-2 {
		width: 100%;
		height: 100%;
		background-color: #606060;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		animation:
			sweep-to-center-reverse 10s linear forwards,
			fade-in 0s linear forwards;
		animation-delay: 10s, 10s;
		opacity: 0;
	}

	.fixate-circle {
		width: 10px;
		height: 10px;
		background-color: green;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: disappear 0.5s linear 9.5s forwards;
	}

	.blink {
		animation: blink 0.4s infinite;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	@keyframes disappear {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes sweep-to-center {
		0% {
			clip-path: circle(50% at 50% 50%);
		}
		100% {
			clip-path: circle(0% at 50% 50%);
		}
	}

	@keyframes sweep-to-center-reverse {
		0% {
			clip-path: circle(0% at 50% 50%);
		}
		100% {
			clip-path: circle(50% at 50% 50%);
		}
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
