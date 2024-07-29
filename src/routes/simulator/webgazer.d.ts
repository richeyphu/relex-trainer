declare module 'webgazer' {
	export interface GazeData {
		x: number;
		y: number;
		all: Array<{ x: number; y: number }>;
		eyeFeatures: {
			left: {
				patch: ImageData;
				imagex: number;
				imagey: number;
				width: number;
				height: number;
			};
			right: {
				patch: ImageData;
				imagex: number;
				imagey: number;
				width: number;
				height: number;
			};
		};
	}

	export interface WebGazer {
		setRegression(regression: string): WebGazer;
		setGazeListener(callback: (data: GazeData | null, clock: number) => void): WebGazer;
		saveDataAcrossSessions(save: boolean): WebGazer;
		showVideoPreview(show: boolean): WebGazer;
		showPredictionPoints(show: boolean): WebGazer;
		applyKalmanFilter(apply: boolean): WebGazer;
		getCurrentPrediction(): GazeData;
		begin(): Promise<void>;
		end(): () => void;
		pause(): () => void;
		resume(): () => void;
	}

	const webgazer: WebGazer;
	export default webgazer;
}
