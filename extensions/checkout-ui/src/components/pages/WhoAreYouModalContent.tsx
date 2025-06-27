import {
    BlockSpacer,
    BlockStack,
    Button,
    Form,
    Heading,
    Link,
    TextBlock,
    TextField,
    useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext, useState } from "react";
import { useRefereeRegister } from "../../hooks/useRefereeRegister";
import { RefereeJourneyContext } from "../../context/RefereeJourneyContext";
import { isValidEmail } from "../../../../../shared/utils";
import { decode, EntityLevel } from "entities";
import { ErrorBoundary } from "@sentry/react";
import { consoleError } from "../../../../../shared/logging";

export const WhoAreYouModalContent = () => {
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
        <ErrorBoundary
            beforeCapture={(scope, error) => {
                consoleError("WhoAreYouModalContent", "Error boundary caught error", error);

                scope.setTag("component", "WhoAreYouModalContent");
            }}
        >
            <Form disabled={loadingConsumerApi} onSubmit={onSubmit}>
                <BlockStack>
                    <Heading level={1}>{decode(nameSearchResult.content.headline || "", EntityLevel.HTML)}</Heading>
                    <TextBlock>{decode(nameSearchResult.content.description || "", EntityLevel.HTML)}</TextBlock>
                    <TextField
                        error={errors?.email}
                        icon={{ source: "email", position: "end" }}
                        label={translate("who-are-you.form.label.your-email")}
                        name="email"
                        onChange={(value) => {
                            setRegisterEmail(value);
                        }}
                        required
                        type="email"
                    />
                    <TextBlock appearance="subdued">
                        {decode(
                            nameSearchResult.result.referrer.offer.privacyNotice ||
                                translate("who-are-you.privacy.text"),
                            EntityLevel.HTML
                        )}{" "}
                        <Link external to={nameSearchResult.result.referrer.offer.privacyLink}>
                            {translate("who-are-you.privacy.link")}
                        </Link>{" "}
                        {translate("who-are-you.terms.text")}{" "}
                        <Link external to={nameSearchResult.result.termsLinks.linkToTermsInLocale}>
                            {translate("who-are-you.terms.link")}
                        </Link>
                        .
                    </TextBlock>
                </BlockStack>
                <BlockSpacer />
                <Button accessibilityRole="submit" loading={loadingConsumerApi}>
                    {nameSearchResult?.content?.cta || translate("who-are-you.form.submit")}
                </Button>
            </Form>
        </ErrorBoundary>
    );
};
