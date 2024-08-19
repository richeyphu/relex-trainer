<script lang="ts">
	import { useWebGazerLifecycle } from '../simulator/hooks.client';
	import type { GazeData } from 'webgazer';

	let clickCounts = Array(9).fill(0);

	function handleClick(index: number) {
		if (clickCounts[index] <= 5) {
			clickCounts[index] += 1;
		}
	}

	function getCircleColor(clickCount: number): string {
		return clickCount === 0
			? 'rgb(255, 0, 0)'
			: clickCount === 1
				? 'rgb(204, 51, 0)'
				: clickCount === 2
					? 'rgb(153, 102, 0)'
					: clickCount === 3
						? 'rgb(102, 153, 0)'
						: clickCount === 4
							? 'rgb(51, 204, 0)'
							: 'rgb(0, 255, 0)';
	}

	useWebGazerLifecycle(
		(data: GazeData | null, clock: number) => {
			console.log(data);
			console.log(clock);
		},
		() => {
			console.log('WebGazer component destroyed');
		}
	)
		.then(() => {
			console.log('WebGazer initialized');
		})
		.catch((error) => {
			console.error('Failed to initialize WebGazer:', error);
		});
</script>

<svelte:head>
	<title>Calibrate | ReLEx Trainer</title>
	<meta
		name="description"
		content="ReLEx SMILE Simulator: Keep your eye still during LASIK Surgery."
	/>
</svelte:head>

<main class="grid h-screen w-screen grid-cols-3 grid-rows-3 items-center">
	{#each clickCounts as clickCount, index}
		<div class="flex items-center justify-center">
			<button
				class="m-2 h-6 w-6 rounded-full transition-colors duration-500"
				class:rotate={clickCount === 5}
				on:click={() => handleClick(index)}
				style="background-color: {getCircleColor(clickCount)};"
				type="button"
			>
			</button>
		</div>
	{/each}
</main>

<style>
	:root {
		background-color: black !important;
	}

	@keyframes sweep {
		from {
			clip-path: polygon(50% 50%, 50% 0%, 50% 0%);
		}
		to {
			clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%);
		}
	}
</style>
