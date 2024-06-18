import { Banner, BlockLayout, Button, Form, Grid, Modal, TextField } from "@shopify/ui-extensions-react/checkout";
import { fetchRefereeFindFriend } from "./refereeFindFriend";
import { FoundReferrerState, NameSearchResult, SITUATION } from "./Checkout";
import { Environment } from "../../../shared/utils";
import { useEffect, useState } from "react";
import { NameSearchResultBanner } from "./NameSearchResultBanner";
import { registerReferee } from "./refereeRegisterFriend";

interface WhoAreYouModalProps {
	environment: Environment;
	mmPartnerCode: string;
	foundReferrerState: FoundReferrerState;
	setRefereeRegisterResult: React.Dispatch<any>;
}

export const WhoAreYouModal = (args: WhoAreYouModalProps) => {
	const {
		environment,
		mmPartnerCode,
		foundReferrerState,
		setRefereeRegisterResult
	} = args;

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

					registerReferee({
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
