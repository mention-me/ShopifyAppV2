import {
	Banner,
	BlockLayout,
	BlockStack,
	Button,
	Checkbox,
	Form,
	Link,
	Modal,
	TextBlock,
	TextField,
	useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext, useState } from "react";
import { useRefereeRegister } from "../hooks/useRefereeRegister";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { isValidEmail } from "../../../../shared/utils";

export const WhoAreYouModal = () => {
	const { nameSearchResult, loadingConsumerApi } = useContext(RefereeJourneyContext);

	const translate = useTranslate();

	const [registerEmail, setRegisterEmail] = useState("");

	const [errors, setErrors] = useState<{ email?: string }>({});

	if (!nameSearchResult.result) {
		throw new Error("Expected nameSearchResult result to be defined");
	}

	const registerSubmitCallback = useRefereeRegister();

	// This is a little overcomplicated for one field - but it's stolen from FindFriendModal.tsx and copied
	// for simplicity/consistency.
	const onSubmit = useCallback(() => {
		const emailError = isValidEmail(registerEmail) ? undefined : translate("who-are-you.form.error.your-email");

		setErrors({
			email: emailError,
		});

		if (emailError) {
			return;
		}

		registerSubmitCallback(registerEmail);
	}, [registerEmail, registerSubmitCallback, translate]);

	return (
		<Modal padding
			   title="Welcome!!">
			<BlockLayout>
				<Form
					disabled={loadingConsumerApi}
					onSubmit={onSubmit}
				>
					<BlockStack>
						<Banner status="success"
								title="Welcome!" />
						<TextField error={errors?.email}
								   icon={{ source: "email", position: "end" }}
								   label={translate("who-are-you.form.label.your-email")}
								   name="email"
								   onChange={(value) => {
									   setRegisterEmail(value);
								   }}
								   required
								   type="email"
						/>
						<Link external
							  to={nameSearchResult.result.termsLinks.linkToTermsInLocale}
						>
							{translate("who-are-you.form.terms-link")}
						</Link>
						<TextBlock>Privacy policy stuff</TextBlock>
						<Checkbox>Opt in</Checkbox>
						<Button
							accessibilityRole="submit"
							loading={loadingConsumerApi}
						>
							{translate("who-are-you.form.submit")}
						</Button>
					</BlockStack>
				</Form>
			</BlockLayout>
		</Modal>);

};
