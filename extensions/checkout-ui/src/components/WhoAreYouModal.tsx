import { Banner, BlockLayout, Button, Form, Grid, Modal, TextField } from "@shopify/ui-extensions-react/checkout";
import { useRefereeFindFriend } from "../hooks/useRefereeFindFriend";
import { FoundReferrerState, NameSearchResult, SITUATION } from "../Checkout";
import { Environment } from "../../../../shared/utils";
import { useContext, useEffect, useState } from "react";
import { NameSearchResultBanner } from "./NameSearchResultBanner";
import { useRefereeRegister } from "../hooks/useRefereeRegister";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";

export const WhoAreYouModal = () => {
	const { mmPartnerCode, environment, step, refereeEntryPointResponse } = useContext(RefereeJourneyContext);

	const [registering, setRegistering] = useState(false);
	const [formStateEmail, setFormStateEmail] = useState("");

	if (!foundReferrerState) {
		throw new Error("Expected foundReferrerState to be defined");
	}

	return (<Modal title="Welcome!!" padding>
		<BlockLayout>
			<Form
				onSubmit={() => {
					setRegistering(true);

					useRefereeRegister({
						environment,
						mmPartnerCode,
						email: formStateEmail,
						situation: SITUATION,
						foundReferrerState,
						setRefereeRegisterResult
					});
				}}
				disabled={registering}
			>
				<Grid spacing="base">
					<Banner title="Welcome!" status="success" />
					<TextField label="What is your email address?"
							   icon={{ source: "email", position: "end" }}
							   autocomplete={false}
							   name="email"
							   type="email"
							   required
							   onChange={(value) => {
								   setFormStateEmail(value);
							   }}
					/>
					<Button
						loading={registering}
						accessibilityRole="submit"
					>
						Get my reward
					</Button>
				</Grid>
			</Form>
		</BlockLayout>
	</Modal>);

};
