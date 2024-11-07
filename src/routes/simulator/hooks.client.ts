import { onDestroy, onMount } from 'svelte';
import type { GazeData, WebGazer } from 'webgazer';

export function useWebGazerLifecycle(
	onGazeListener: (data: GazeData | null, clock: number) => void,
	onDestroyCallback: () => void
): Promise<WebGazer> {
	let webgazer: WebGazer;

	const webgazerPromise = new Promise<WebGazer>((resolve, reject) => {
		onMount(async () => {
			try {
				const module = await import('webgazer');
				webgazer = module.default;
				window.webgazer = webgazer;

				resolve(webgazer);

				// Start the webgazer tracker
				await webgazer
					.setRegression('ridge') // currently must set regression and tracker
					// .setTracker('clmtrackr')
					.setGazeListener(onGazeListener)
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
						alert(
							'Failed to access the camera. Please check your camera settings and permissions.'
						);
					}
				} else {
					console.error('An unknown error occurred:', error);
					alert('An unknown error occurred. Please try again.');
				}
				reject(error);
			}
		});

		onDestroy(() => {
			if (webgazer) {
				try {
					webgazer.end();
				} catch (error: unknown) {
					console.error('Failed to stop webgazer:', error);
				}
			}
			onDestroyCallback();
		});
	});

	return webgazerPromise;
}
