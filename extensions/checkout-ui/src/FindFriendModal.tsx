import { Banner, BlockLayout, Button, Form, Grid, Modal, TextField } from "@shopify/ui-extensions-react/checkout";
import { fetchRefereeFindFriend } from "./refereeFindFriend";
import { FoundReferrerState, NameSearchResult, SITUATION } from "./Checkout";
import { Environment } from "../../../shared/utils";
import React, { useEffect, useState } from "react";
import { NameSearchResultBanner } from "./NameSearchResultBanner";

interface FindFriendModalProps {
	environment: Environment;
	mmPartnerCode: string;
	shouldProvideEmail: boolean;
	setShouldProvideEmail: React.Dispatch<boolean>;
	nameSearchResult: NameSearchResult;
	setNameSearchResult: React.Dispatch<NameSearchResult>;
	setFoundReferrerState: React.Dispatch<FoundReferrerState>;
}

export const FindFriendModal = (args: FindFriendModalProps) => {
	const {
		environment,
		mmPartnerCode,
		shouldProvideEmail,
		setShouldProvideEmail,
		nameSearchResult,
		setNameSearchResult,
		setFoundReferrerState
	} = args;

	const [formStateName, setFormStateName] = useState("");
	const [formStateEmail, setFormStateEmail] = useState("");

	useEffect(() => {
		console.log("nameSearchResult", nameSearchResult);
		/*
		Rules:

		1. If loading, don't change anything.
		2. If found by name - next step
		3. If multiple matches by name - duplicate match, ask for email
		4. If no matches by name - ask for email
		5. If found by email - next step
		6. If not found by email - give up.
		 */

		if (nameSearchResult === "duplicate-match") {
			setShouldProvideEmail(true);
			return;
		}

		if (nameSearchResult === "no-match") {
			setShouldProvideEmail(true);
			return;
		}
	}, [nameSearchResult, setShouldProvideEmail]);

	return (<Modal title="Welcome! Let us know who sent you." padding>
		<BlockLayout>
			<Form
				onSubmit={() => {
					setNameSearchResult("loading");

					fetchRefereeFindFriend({
						environment,
						mmPartnerCode,
						name: formStateName,
						email: formStateEmail,
						situation: SITUATION,
						setNameSearchResult,
						setFoundReferrerState,
					});
				}}
				disabled={nameSearchResult === "loading"}
			>
				<Grid spacing="base">
					<NameSearchResultBanner nameSearchResult={nameSearchResult} shouldProvideEmail={shouldProvideEmail}  />
					<TextField label="Your friends name"
							   icon={{ source: "magnify", position: "end" }}
							   autocomplete={false}
							   name="name"
							   required
							   onChange={(value) => {
								   setFormStateName(value);
							   }}
					/>
					{shouldProvideEmail && (
						<TextField label="Your friends email"
								   type="email"
								   icon={{ source: "email", position: "end" }}
								   autocomplete={false}
								   name="email"
								   required
								   onChange={(value) => {
									   setFormStateEmail(value);
								   }}
						/>
					)}
					<Button
						loading={nameSearchResult === "loading"}
						accessibilityRole="submit"
					>
						Submit
					</Button>
				</Grid>
			</Form>
		</BlockLayout>
	</Modal>);

};
