import { BlockLayout, Button, Form, Grid, Modal, TextField } from "@shopify/ui-extensions-react/checkout";
import { useRefereeFindFriend } from "../hooks/useRefereeFindFriend";
import { useContext, useEffect, useState } from "react";
import { RefereeJourneyContext, RefereeSearch } from "../context/RefereeJourneyContext";


export function FindFriendModal() {
	const {
		loadingConsumerApi,
		step,
		setSearch,
		nameSearchResult,
	} = useContext(RefereeJourneyContext);

	const [shouldProvideEmail, setShouldProvideEmail] = useState(false);

	useEffect(() => {
		console.log("nameSearchResult", nameSearchResult);

		if (!nameSearchResult) {
			setShouldProvideEmail(false);
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
			setShouldProvideEmail(true);
			return;
		}
	}, [nameSearchResult, setShouldProvideEmail]);

	const onSubmit = useRefereeFindFriend();

	return (<Modal
		padding
		title="Welcome! Let us know who sent you.">
		<BlockLayout>
			<Form
				disabled={loadingConsumerApi}
				onSubmit={onSubmit}
			>
				<Grid spacing="base">
					{/*<NameSearchResultBanner nameSearchResult={nameSearchResult}*/}
					{/*						shouldProvideEmail={shouldProvideEmail} />*/}
					<TextField
						autocomplete={false}
						icon={{ source: "magnify", position: "end" }}
						label="Your friends name"
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
					{step === "search-by-name-and-email" && (
						<TextField
							autocomplete={false}
							icon={{ source: "email", position: "end" }}
							label="Your friends email"
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
						/>
					)}
					<Button
						accessibilityRole="submit"
						loading={loadingConsumerApi}
					>
						Submit
					</Button>
				</Grid>
			</Form>
		</BlockLayout>
	</Modal>);

}
