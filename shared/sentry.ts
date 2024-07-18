import * as Sentry from "@sentry/browser";
import { APP_VERSION } from "./constants";

export const setupSentry = (shop: string, extension: string) => {

	Sentry.init({
		dsn: "https://37a7e53e4779b0c510e05239d8b25822@sentry.devtools.mentionme.tech/7",
		defaultIntegrations: false,
		release: `${APP_VERSION}`,
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
			console.error("unhandledrejection", error);
			Sentry.captureException(error);
		},
	);
	self.addEventListener("error", (error) => {
		console.error("error", error);
		Sentry.captureException(error);
	});
};
