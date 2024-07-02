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
import { useRefereeFindFriend } from "../hooks/useRefereeFindFriend";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { RefereeJourneyContext, RefereeSearch } from "../context/RefereeJourneyContext";
import { isValidEmail } from "../../../../shared/utils";


export const FindFriendModalContent = () => {
	const {
		loadingConsumerApi,
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

	const [nameSearchedFor, setNameSearchedFor] = useState<string>();

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

		setNameSearchedFor(search?.name);

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
		console.log(shouldProvideEmail);
		console.log(nameSearchResult);
		if (!shouldProvideEmail) {
			return [
				translate("find-friend.heading"),
				translate("find-friend.description")
			];
		}

		if (step === "duplicate-match") {
			return [
				translate("find-friend.dupe-match.heading", { name: nameSearchedFor }),
				translate("find-friend.dupe-match.description"),
			];
		}

		if (step === "no-match") {
			return [
				translate("find-friend.no-match.heading", { name: nameSearchedFor }),
				translate("find-friend.no-match.description"),
			];
		}

		throw new Error("Unknown name search result type");
	}, [nameSearchResult, step, nameSearchedFor, shouldProvideEmail, translate]);

	return (
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
					label={translate("find-friend.form.label.friend-name")}
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
						label={translate("find-friend.form.label.friend-email")}
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
				{translate("find-friend.form.submit")}
			</Button>
		</Form>
	);
};
