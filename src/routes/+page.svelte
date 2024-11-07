<script lang="ts">
	import { DESCRIPTION, TITLE } from '$lib';
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<section class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-lg">
			<h1 class="text-5xl font-bold">ReLEx Trainer</h1>
			<p class="py-6">ReLEx SMILE Simulator: Keep your eye still during LASIK Surgery.</p>
			<div class="flex items-center justify-center gap-2">
				<a href="/simulator" class="btn btn-primary">Get Started</a>
				<a href="/vr" class="btn btn-secondary">VR Mode</a>
			</div>
		</div>
	</div>
</section>
<footer class="absolute bottom-0 flex w-full justify-center p-2">
	<div class="text-sm font-extralight">
		made with ❤️ by
		<a class="link-hover link link-primary" href="https://phurit.de" target="_blank">phurit.de</a>
	</div>
</footer>
