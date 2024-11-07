<script lang="ts">
	import { DESCRIPTION, TITLE } from '$lib';
	import { EyeAnimation } from '$lib/components';
	import Icon from '@iconify/svelte';

	let shouldAnimate = $state(true);

	function restartAnimation() {
		shouldAnimate = false;
		setTimeout(() => {
			shouldAnimate = true;
		}, 0);
	}
</script>

<svelte:head>
	<title>Simulator | {TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<main>
	<section class="flex h-screen items-center justify-center">
		<div class="portrait:w-11/12 landscape:h-3/5">
			<EyeAnimation play={shouldAnimate} />
		</div>
	</section>

	<footer class="fixed bottom-2 left-0 flex w-full justify-between px-2">
		<div>
			<a class="btn btn-square btn-neutral text-xl" href="/" role="button" title="Home">
				<Icon icon="mi:home" />
			</a>
		</div>
		<div class="flex space-x-2">
			<button
				class="btn btn-square btn-secondary text-xl"
				onclick={restartAnimation}
				title="Restart"
			>
				<Icon icon="mi:refresh" />
			</button>
		</div>
	</footer>
</main>

<style>
	:root {
		background-color: black !important;
	}
</style>
