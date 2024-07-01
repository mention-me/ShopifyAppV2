import * as Sentry from '@sentry/browser';

export const setupSentry = () => {

	Sentry.init({
		dsn: "https://37a7e53e4779b0c510e05239d8b25822@sentry.devtools.mentionme.tech/7",
		defaultIntegrations: false,
	});

	self.addEventListener(
		'unhandledrejection',
		(error) => {
			console.error("unhandledrejection", error);
			Sentry.captureException(
				new Error(error?.reason?.stack),
			);
		},
	);
	self.addEventListener('error', (error) => {
		console.error("error", error);
		Sentry.captureException(
			new Error(error?.reason?.stack),
		);
	});
};
