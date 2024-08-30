<script lang="ts">
	import { TITLE, DESCRIPTION } from '$lib';
	import { onMount } from 'svelte';

	let animateLeft = false;
	let animateRight = false;
	let countdown = 10;
	let isLandscape = false;
	let vrStarted = false;

	const startVR = () => {
		vrStarted = true;
		countdown = 10;
		animateLeft = false;
		animateRight = false;
		document.documentElement.requestFullscreen();
	};

	const checkLandscape = () => {
		isLandscape = window.matchMedia('(orientation: landscape)').matches;
	};

	onMount(() => {
		checkLandscape();
		window.addEventListener('resize', checkLandscape);

		const countdownInterval = setInterval(() => {
			if (vrStarted && countdown > -60) {
				countdown -= 1;
			} 
			// else if (countdown <= -60) {
			// 	vrStarted = false;
			// 	clearInterval(countdownInterval);
			// }
		}, 1000);

		return () => {
			window.removeEventListener('resize', checkLandscape);
			clearInterval(countdownInterval);
		};
	});

	$: {
		if (countdown === 0) {
			animateRight = true;
		} else if (countdown === -20) {
			animateRight = false;
		} else if (countdown === -30) {
			animateLeft = true;
		} else if (countdown === -50) {
			animateLeft = false;
		} else if (countdown === -60) {
			startVR(); // Loop
		}
	}
</script>

<svelte:head>
	<title>VR Mode | {TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<main class="grid h-screen grid-flow-col gap-1">
	<div class="m-auto w-10/12">
		{#if animateLeft}
			<div class="outer-circle aspect-square">
				<div class="inner-circle-1" />
				<div class="inner-circle-2" />
				<div class="blink">
					<div class="fixate-circle" />
				</div>
			</div>
		{/if}
	</div>
	<div class="absolute right-1/2 h-screen w-[1px] bg-slate-800">
		<!-- Divider -->
	</div>
	<div class="m-auto w-10/12">
		{#if animateRight}
			<div class="outer-circle aspect-square">
				<div class="inner-circle-1" />
				<div class="inner-circle-2" />
				<div class="blink">
					<div class="fixate-circle" />
				</div>
			</div>
		{/if}
	</div>
	{#if !animateLeft && !animateRight}
		<div class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
			<div class="card bg-gray-800">
				<div class="card-body text-lg text-gray-400">
					{#if !vrStarted}
						<button class="btn btn-primary" on:click={startVR}> Start VR </button>
					{:else}
						<p>
							{#if !isLandscape}
								Please rotate your device to landscape mode.
							{:else if countdown >= 0}
								VR will start in {countdown} second{countdown > 1 ? 's' : ''}...
							{:else if countdown >= -30}
								Rest: {Math.abs(countdown + 30)}
							{:else}
								VR has ended. Restart in {Math.abs(countdown + 60)}...
							{/if}
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	:root {
		background-color: black !important;
	}

	.outer-circle {
		width: 100%;
		height: 100%;
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
