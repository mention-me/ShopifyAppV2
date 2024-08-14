import {
	BlockSpacer,
	BlockStack,
	Button,
	Form,
	Heading,
	TextBlock,
	TextField,
	useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { useRefereeFindFriend } from "../../hooks/useRefereeFindFriend";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { RefereeJourneyContext, RefereeSearch } from "../../context/RefereeJourneyContext";
import { isValidEmail } from "../../../../../shared/utils";

import { decode } from "entities";
import { ErrorBoundary } from "@sentry/react";

export const FindFriendModalContent = () => {
	const {
		loadingConsumerApi,
		refereeContentApiResponse,
		search,
		setSearch,
		step,
		setStep,
		nameSearchResult,
		setNameSearchResult,
	} = useContext(RefereeJourneyContext);

	const translate = useTranslate();

	const [shouldProvideEmail, setShouldProvideEmail] = useState(false);

	const [errors, setErrors] = useState<{ name?: string, email?: string }>({});

	useEffect(() => {
		if (!nameSearchResult) {
			return;
		}

		const { type } = nameSearchResult;

		/*
		Rules:

		1. If loading, don't change anything.
		2. If found by name - next step
		3. If multiple matches by name - duplicate match, ask for email
		4. If no matches by name - ask for email
		5. If found by email - next step
		6. If not found by email - give up.
		 */

		if (type === "duplicate-match") {
			setShouldProvideEmail(true);
			setStep("duplicate-match");
			return;
		}

		if (type === "no-match") {
			setShouldProvideEmail(true);
			setStep("no-match");
			return;
		}

		if (type === "no-match-final") {
			setStep("no-match-final");
		}
	}, [nameSearchResult, setNameSearchResult, shouldProvideEmail, setShouldProvideEmail, step, setStep, search?.name]);

	const findFriendSubmitCallback = useRefereeFindFriend();

	const onSubmit = useCallback(() => {
		const nameError = search?.name ? undefined : translate("find-friend.form.error.name.missing");
		const emailError = !shouldProvideEmail || isValidEmail(search?.email) ? undefined : translate("find-friend.form.error.email.missing-or-invalid");

		setErrors({
			name: nameError,
			email: emailError,
		});

		if (nameError || emailError) {
			return;
		}

		findFriendSubmitCallback();
	}, [findFriendSubmitCallback, search, shouldProvideEmail, setErrors, translate]);

	const [heading, description] = useMemo(() => {
		const headline: string = nameSearchResult?.content?.headline || refereeContentApiResponse.headline;
		const description: string = nameSearchResult?.content?.description || refereeContentApiResponse.searchText;

		return [
			decode(headline),
			decode(description),
		];
	}, [refereeContentApiResponse, nameSearchResult]);

	return (
		<ErrorBoundary beforeCapture={(scope) => {
			scope.setTag("component", "FindFriendModalContent");
		}}>
			<Form
				disabled={loadingConsumerApi}
				onSubmit={onSubmit}
			>
				<BlockStack>
					<Heading level={1}>
						{heading}
					</Heading>
					<TextBlock>
						{description}
					</TextBlock>
					<TextField
						autocomplete={false}
						error={errors?.name}
						icon={{ source: "magnify", position: "end" }}
						label={refereeContentApiResponse.nameInputPlaceholder}
						name="name"
						onChange={(value) => {
							setSearch((existing: RefereeSearch) => {
								return {
									...existing,
									name: value,
								};
							});
						}}
						required
						value={search?.name}
					/>
					{shouldProvideEmail ?
						<TextField
							autocomplete={false}
							error={errors?.email}
							icon={{ source: "email", position: "end" }}
							label={refereeContentApiResponse.emailInputPlaceholder}
							name="email"
							onChange={(value) => {
								setSearch((existing: RefereeSearch) => {
									return {
										...existing,
										email: value,
									};
								});
							}}
							required
							type="email"
							value={search?.email}
						/>
						: null}
				</BlockStack>
				<BlockSpacer />
				<Button
					accessibilityRole="submit"
					loading={loadingConsumerApi}
				>
					{refereeContentApiResponse.searchCta}
				</Button>
			</Form>
		</ErrorBoundary>
	);
};
