<script lang="ts">
	import { TITLE, DESCRIPTION } from '$lib';

	let shouldAnimateLeft = false;
	let shouldAnimateRight = false;
	let countdown = 10;

	const countdownInterval = setInterval(() => {
		if (countdown > -60) {
			countdown -= 1;
		} else {
			clearInterval(countdownInterval);
		}
	}, 1000);

	$: {
		if (countdown === 0) {
			shouldAnimateRight = true;
		} else if (countdown === -20) {
			shouldAnimateRight = false;
		} else if (countdown === -30) {
			shouldAnimateLeft = true;
		} else if (countdown === -50) {
			shouldAnimateLeft = false;
		}
	}
</script>

<svelte:head>
	<title>VR Mode | {TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<main class="grid h-screen grid-flow-col gap-1">
	<div class="m-auto w-10/12">
		{#if shouldAnimateLeft}
			<div class="outer-circle aspect-square">
				<div class="inner-circle-1" />
				<div class="inner-circle-2" />
				<div class="blink">
					<div class="fixate-circle" />
				</div>
			</div>
		{/if}
	</div>
	<div class="absolute right-1/2 h-screen w-[1px] bg-slate-800"></div>
	<div class="m-auto w-10/12">
		{#if shouldAnimateRight}
			<div class="outer-circle aspect-square">
				<div class="inner-circle-1" />
				<div class="inner-circle-2" />
				<div class="blink">
					<div class="fixate-circle" />
				</div>
			</div>
		{/if}
	</div>
	{#if !shouldAnimateLeft && !shouldAnimateRight}
		<div class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					{#if countdown >= 0}
						<p>
							VR will start in {countdown} second{countdown > 1 ? 's' : ''}...
						</p>
					{:else if countdown >= -30}
						<p>Rest: {Math.abs(countdown + 30)}</p>
					{:else}
						<p>VR has ended</p>
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
