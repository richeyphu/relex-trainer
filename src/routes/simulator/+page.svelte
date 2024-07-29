<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { WebGazer, GazeData } from 'webgazer';

	let isTracking = true;
	let shouldAnimate = true;
	let webgazer: WebGazer;

	onMount(async () => {
		const module = await import('webgazer');
		webgazer = module.default;

		window.webgazer = webgazer;

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
					<div class="fixate-circle disappear" />
				</div>
			</div>
		</div>
	</section>
{/if}

<footer class="fixed bottom-2 left-0 flex justify-between w-full px-2">
	<div>
		<a class="btn btn-neutral" href="/">Back</a>
	</div>
	<div class="flex space-x-2">
		<button class="btn btn-primary" on:click={toggleTracking}>
			{#if isTracking}
				Eye Tracking: OFF
			{:else}
				Eye Tracking: ON
			{/if}
		</button>
		<button class="btn btn-secondary" on:click={restartAnimation}>Restart</button>
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
