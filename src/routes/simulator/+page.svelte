<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import type { WebGazer, GazeData } from 'webgazer';

	let isTracking = true;
	let shouldAnimate = true;
	let webgazer: WebGazer;

	onMount(async () => {
		const module = await import('webgazer');
		webgazer = module.default;
		window.webgazer = webgazer;

		try {
			// Start the webgazer tracker
			await webgazer
				.setRegression('ridge') // currently must set regression and tracker
				// .setTracker('clmtrackr')
				.setGazeListener((data: GazeData | null, clock: number) => {
					console.log(data); // data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting)
					console.log(clock); // elapsed time in milliseconds since webgazer.begin() was called
				})
				.saveDataAcrossSessions(true)
				.begin();
			webgazer
				.showVideoPreview(true) // shows all video previews
				.showPredictionPoints(true) // shows a square every 100 milliseconds where current prediction is
				.applyKalmanFilter(true); // Kalman Filter defaults to on. Can be toggled by user.
		} catch (error: unknown) {
			if (error instanceof Error) {
				if (error.name === 'NotAllowedError') {
					console.error('Camera access denied:', error);
					alert('Camera access was denied. Please allow camera access and try again.');
				} else if (error.name === 'NotFoundError') {
					console.error('No camera found:', error);
					alert('No camera was found. Please connect a camera and try again.');
				} else if (error.name === 'NotReadableError') {
					console.error('Camera is not readable:', error);
					alert('The camera is not readable. It might be in use by another application.');
				} else {
					console.error('Failed to initialize webgazer:', error);
					alert('Failed to access the camera. Please check your camera settings and permissions.');
				}
			} else {
				console.error('An unknown error occurred:', error);
				alert('An unknown error occurred. Please try again.');
			}
		}
	});

	onDestroy(() => {
		if (typeof webgazer !== 'undefined') {
			webgazer.end(); // Stop the webgazer tracker
		}
	});

	function toggleTracking() {
		if (isTracking) {
			webgazer.end();
		} else {
			webgazer.begin();
		}
		isTracking = !isTracking;
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
