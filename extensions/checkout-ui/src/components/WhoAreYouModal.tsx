import { Banner, BlockLayout, Button, Form, Grid, Modal, TextField } from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext, useState } from "react";
import { useRefereeRegister } from "../hooks/useRefereeRegister";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { isValidEmail } from "../../../../shared/utils";

export const WhoAreYouModal = () => {
	const { nameSearchResult, loadingConsumerApi } = useContext(RefereeJourneyContext);

	const [registerEmail, setRegisterEmail] = useState("");

	const [errors, setErrors] = useState<{ email?: string }>({});

	if (!nameSearchResult.result) {
		throw new Error("Expected nameSearchResult result to be defined");
	}

	const registerSubmitCallback = useRefereeRegister();

	// This is a little overcomplicated for one field - but it's stolen from FindFriendModal.tsx and copied
	// for simplicity/consistency.
	const onSubmit = useCallback(() => {
		const emailError = isValidEmail(registerEmail) ? undefined : "Please enter your own email.";

		setErrors({
			email: emailError,
		});

		if (emailError) {
			return;
		}

		registerSubmitCallback(registerEmail);
	}, [registerEmail, registerSubmitCallback]);

	return (
		<Modal padding
			   title="Welcome!!">
			<BlockLayout>
				<Form
					disabled={loadingConsumerApi}
					onSubmit={onSubmit}
				>
					<Grid spacing="base">
						<Banner status="success"
								title="Welcome!" />
						<TextField error={errors?.email}
								   icon={{ source: "email", position: "end" }}
								   label="What is your email address?"
								   name="email"
								   onChange={(value) => {
									   setRegisterEmail(value);
								   }}
								   required
								   type="email"
						/>
						<Button
							accessibilityRole="submit"
							loading={loadingConsumerApi}
						>
							Get my reward
						</Button>
					</Grid>
				</Form>
			</BlockLayout>
		</Modal>);

};
