<script lang="ts">
	import { run } from 'svelte/legacy';

	import { TITLE, DESCRIPTION } from '$lib';
	import { EyeAnimation } from '$lib/components';
	import { onMount, onDestroy } from 'svelte';

	let animateLeft = $state(false);
	let animateRight = $state(false);
	let countdown = $state(10);
	let isLandscape = $state(false);
	let vrStarted = $state(false);
	let wakeLock: WakeLockSentinel | null = null;

	const startVR = async () => {
		vrStarted = true;
		countdown = 10;
		animateLeft = false;
		animateRight = false;

		try {
			await document.documentElement.requestFullscreen();
		} catch (error) {
			console.error('Failed to enter fullscreen:', error);
		}

		try {
			if ('wakeLock' in navigator) {
				wakeLock = await navigator.wakeLock.request();
				console.log('Wake lock is active');
			} else {
				console.warn('Wake Lock API is not supported in this browser.');
			}
		} catch (error) {
			console.error('Failed to acquire wake lock:', error);
		}
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
			} else if (countdown <= -60) {
				vrStarted = false;
				clearInterval(countdownInterval);
			}
		}, 1000);

		return () => {
			window.removeEventListener('resize', checkLandscape);
			clearInterval(countdownInterval);
		};
	});

	onDestroy(() => {
		if (wakeLock) {
			wakeLock.release().then(() => {
				console.log('Wake lock released');
				wakeLock = null;
			});
		}
	});

	run(() => {
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
	});
</script>

<svelte:head>
	<title>VR Mode | {TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<main class="grid h-screen grid-flow-col gap-1">
	<div class="m-auto w-10/12">
		<EyeAnimation play={animateLeft} />
	</div>
	<div class="absolute right-1/2 h-screen w-[1px] bg-slate-800">
		<!-- Divider -->
	</div>
	<div class="m-auto w-10/12">
		<EyeAnimation play={animateRight} />
	</div>
	{#if !animateLeft && !animateRight}
		<div class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
			<div class="card bg-gray-800">
				<div class="card-body text-lg text-gray-400">
					{#if !vrStarted}
						<button class="btn btn-primary" onclick={startVR}> Start VR </button>
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
</style>
