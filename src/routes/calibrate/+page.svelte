<script lang="ts">
	import { DESCRIPTION, TITLE } from '$lib';
	import type { GazeData } from 'webgazer';
	import { useWebGazerLifecycle } from '../simulator/hooks.client';

	let clickCounts = $state(Array(9).fill(0));

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
	<title>Calibrate | {TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<main class="grid h-screen w-screen grid-cols-3 grid-rows-3 items-center">
	{#each clickCounts as clickCount, index}
		<div class="flex items-center justify-center">
			<button
				class="m-2 h-6 w-6 rounded-full transition-colors duration-500"
				onclick={() => handleClick(index)}
				style="background-color: {getCircleColor(clickCount)};"
				type="button"
				aria-label="Click me"
			>
			</button>
		</div>
	{/each}
</main>

<style>
	:root {
		background-color: black !important;
	}
</style>
