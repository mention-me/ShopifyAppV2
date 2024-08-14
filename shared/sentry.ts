import * as Sentry from "@sentry/react";
import { captureException } from "@sentry/react";
import { APP_VERSION } from "./constants";
import { consoleError } from "./logging";

export const setupSentry = (shop: string, extension: string) => {
	Sentry.init({
		dsn: "https://37a7e53e4779b0c510e05239d8b25822@sentry.devtools.mentionme.tech/7",
		defaultIntegrations: false,
		release: APP_VERSION,
		environment: "production",
		attachStacktrace: true,
		initialScope: {
			tags: {
				extension,
				shop,
			},
		},
	});

	self.addEventListener(
		"unhandledrejection",
		(error) => {
			consoleError(
				"Sentry",
				"Unhandled promise rejection",
				error
			);
		},
	);
	self.addEventListener("error", (error) => {
		let err = error.error;

		if ( ! (err instanceof Error)) {
			err = new Error(error.message);
		}

		logError(
			"error",
			"Unhandled error",
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			err
		);
	});
};

export const logError = (context: string, message: string, error: Error) => {
	consoleError(context, message, error);
	captureException(error);
};
