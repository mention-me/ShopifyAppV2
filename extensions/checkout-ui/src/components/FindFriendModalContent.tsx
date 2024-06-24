import { BlockStack, Button, Form, TextField, useTranslate } from "@shopify/ui-extensions-react/checkout";
import { useRefereeFindFriend } from "../hooks/useRefereeFindFriend";
import { useCallback, useContext, useEffect, useState } from "react";
import { RefereeJourneyContext, RefereeSearch } from "../context/RefereeJourneyContext";
import { NameSearchResultBanner } from "./NameSearchResultBanner";
import { isValidEmail } from "../../../../shared/utils";


export const FindFriendModalContent = () => {
	const {
		loadingConsumerApi,
		search,
		setSearch,
		nameSearchResult,
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

		if (type === "duplicate-match" || type === "no-match") {
			// In this two cases, explicitly change it. In all others, don't.
			// Email defaults to being off, so we'll keep it that way if it is off.
			// If it's turned on by either of these two cases, we'll keep it on.
			setShouldProvideEmail(true);
			return;
		}
	}, [nameSearchResult, setShouldProvideEmail]);

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

	return (
		<Form
			disabled={loadingConsumerApi}
			onSubmit={onSubmit}
		>
			<BlockStack>
				<NameSearchResultBanner />
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
				/>
				{shouldProvideEmail ? <TextField
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
				/> : null}
				<Button
					accessibilityRole="submit"
					loading={loadingConsumerApi}
				>
					{translate("find-friend.form.submit")}
				</Button>
			</BlockStack>
		</Form>
	);
};
