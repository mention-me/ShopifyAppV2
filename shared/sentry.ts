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
			logError(
				"unhandledrejection",
				"Unhandled promise rejection",
				new Error(error?.reason?.stack || error?.reason || "Unknown unhandledrejection error"),
			);
		},
	);
	self.addEventListener("error", (error) => {
		logError(
			"error",
			"Unhandled error",
			new Error(error?.message),
		);
	});
};

export const logError = (context: string, message: string, error: Error) => {
	consoleError(context, message, error);
	captureException(error);
};
