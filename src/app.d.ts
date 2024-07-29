// See https://kit.svelte.dev/docs/types#app

import type { WebGazer } from 'webgazer';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		webgazer: WebGazer;
	}
}

export {};
