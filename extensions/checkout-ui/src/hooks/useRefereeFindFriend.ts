import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { APP_NAME, APP_VERSION, SHOPIFY_PREVIEW_MODE_FLAG } from "../../../../shared/constants";
import { useCallback, useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { SITUATION } from "../Checkout";
import { ReferrerFound } from "@api/consumer-api/dist/types";
import { useShop, useLanguage, useExtensionEditor } from "@shopify/ui-extensions-react/checkout";
import useLocale from "../../../../shared/hooks/useLocale";
import { consoleError } from "../../../../shared/logging";
import { logError } from "../../../../shared/sentry";

/**
 * A simple regex to check if an input might be an email.
 */
const EMAIL_REGEX = /^(\S+)@(\S+)$/;

export const useRefereeFindFriend = () => {
	const {
		partnerCode,
		environment,
		defaultLocale,
		setLoadingConsumerApi,
		setNameSearchResult,
		step,
		setStep,
		search,
	} = useContext(RefereeJourneyContext);

	const { myshopifyDomain } = useShop();

	const editor = useExtensionEditor();

	const { isoCode } = useLanguage();

	const locale = useLocale({shopifyLanguage: isoCode, defaultLocale});

	return useCallback(async () => {
		setLoadingConsumerApi(true);

		if (!partnerCode || typeof partnerCode !== "string") {
			consoleError("RefereeFindFriend", "Mention Me partner code not provided", partnerCode);
			return;
		}

		if (!isValidEnvironment(environment)) {
			consoleError("RefereeFindFriend", "Invalid Mention Me environment", environment);
			return;
		}

		const { name, email } = search;

		const url = getDomainForEnvironment(environment);

		const params = new URLSearchParams({
			"request[partnerCode]": partnerCode,
			"request[situation]": SITUATION,
			"request[appName]": APP_NAME  + (editor ? `/${SHOPIFY_PREVIEW_MODE_FLAG}` : ""),
			"request[appVersion]": `${myshopifyDomain}/${APP_VERSION}`,
			"request[localeCode]": locale,
		});

		if (name) {
			params.set("name", name);
		}

		if (email) {
			params.set("email", email);
		}

		try {
			const response = await fetch(`https://${url}/api/consumer/v2/referrer/search?${params.toString()}`,
				{
					method: "GET",
					credentials: "include",
					headers: { accept: "application/json", "Content-Type": "application/json" },
				},
			);

			const json = (await response.json()) as ReferrerFound;

			setLoadingConsumerApi(false);

			const content = json.links && json.links.length > 0 ? json.links[0].resource.reduce((acc, curr) => {
				acc[curr.key] = curr.content;

				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return acc;
			}, {}) : {};

			if (!response.ok) {
				consoleError("RefereeFindFriend", "Response not ok when calling referrerFindFriend:", response);

				if (response.status === 404) {
					if (json?.foundMultipleReferrers) {
						// Can only occur if searching by name. Email search can't get a duplicate match.
						setNameSearchResult({
							type: "duplicate-match",
							result: json,
							content,
						});
						return;
					}

					let type = "no-match";
					// Jump to the no-match-final step if the name is an email or if we're already in the no-match or
					// duplicate match steps.
					if (step === "no-match" || step === "duplicate-match" || EMAIL_REGEX.test(name)) {
						type = "no-match-final";
					}

					setNameSearchResult({
						type,
						result: json,
						content,
					});
					return;
				}

				const message = `Error calling Referee FindFriend API. Response: ${response.status}, ${response.statusText}`;
				logError("RefereeFindFriend", message, new Error(message));

				setNameSearchResult({
					type: "error",
					result: json,
					content,
				});
				return;
			}

			if (response.ok && response.status === 200) {
				if (!json?.referrer?.referrerMentionMeIdentifier || !json?.referrer?.referrerToken) {
					throw new Error("Missing referrerMentionMeIdentifier or referrerToken in response");
				}

				setNameSearchResult(
					{
						type: "single-match",
						result: json,
						content,
					},
				);

				setStep("register");

				return;
			}

			consoleError("RefereeFindFriend", "Unexpected response from API", json);
			setNameSearchResult(
				{
					type: "error",
					result: json,
					content,
				},
			);
			return;
		} catch (error) {
			consoleError("RefereeFindFriend", "Error caught calling referrerFindFriend:", error);
			setNameSearchResult({
				type: "error",
			});
		}
	}, [setLoadingConsumerApi, partnerCode, environment, search, myshopifyDomain, locale, setNameSearchResult, step, setStep, editor]);
};
