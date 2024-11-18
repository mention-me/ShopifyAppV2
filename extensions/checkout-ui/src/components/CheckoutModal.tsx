import {
    Banner,
    BlockSpacer,
    BlockStack,
    Image,
    InlineLayout,
    InlineSpacer,
    Modal,
    TextBlock,
    useTranslate,
    View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext, useMemo } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { WhoAreYouModalContent } from "./pages/WhoAreYouModalContent";
import { FindFriendModalContent } from "./pages/FindFriendModalContent";
import { RegisterResultModalContent } from "./pages/RegisterResultModalContent";
import NoMatchModalContent from "./pages/NoMatchModalContent";
import { consoleError } from "../../../../shared/logging";
import { ErrorBoundary } from "@sentry/react";
import ModalContent from "./ModalContent";

export const CHECKOUT_MODAL_ID = "been-referred-by-friend-modal";

export const CheckoutModal = () => {
    const { step, refereeContentApiResponse, mentionMeConfig } = useContext(RefereeJourneyContext);

    const translate = useTranslate();

    const modalContent = useMemo(() => {
        if (step === "search-by-name" || step === "duplicate-match" || step === "no-match") {
            return (
                <ModalContent componentName="FindFriendModal">
                    <FindFriendModalContent />
                </ModalContent>
            );
        }

        if (step === "register") {
            return (
                <ModalContent componentName="FindFriendModal">
                    <WhoAreYouModalContent />
                </ModalContent>
            );
        }

        if (step === "register-result") {
            return (
                <ModalContent componentName="FindFriendModal">
                    <RegisterResultModalContent />
                </ModalContent>
            );
        }

        if (step === "no-match-final") {
            return (
                <ModalContent componentName="FindFriendModal">
                    <NoMatchModalContent />
                </ModalContent>
            );
        }

        consoleError("Unknown step", step);
        return <Banner status="critical" title={translate("checkout.modal.error")} />;
    }, [step, translate]);

    return (
        <ErrorBoundary
            beforeCapture={(scope, error) => {
                consoleError("CheckoutModal", "Error boundary caught error", error);

                scope.setTag("component", "CheckoutModal");
            }}
        >
            <Modal id={CHECKOUT_MODAL_ID} padding title={refereeContentApiResponse.entryCta}>
                <BlockStack padding="base">
                    {/*
				No amount of faffing around with maxBlockSize seems to constrain the height of the image,
				so it's assumed you've already got the image the right height.
				*/}
                    {mentionMeConfig?.refereeBannerImage?.url && (
                        <>
                            <View>
                                <Image
                                    borderRadius="large"
                                    fit="cover"
                                    source={mentionMeConfig.refereeBannerImage?.url}
                                />
                            </View>
                            <BlockSpacer />
                        </>
                    )}
                    {modalContent}
                    <BlockSpacer spacing="extraLoose" />
                    <View display="inline">
                        <InlineLayout blockAlignment="start" columns="auto" maxBlockSize={5}>
                            <TextBlock size="small">{translate("powered-by")}</TextBlock>
                            <InlineSpacer spacing="extraTight" />
                            <Image fit="cover" source="https://static.mention-me.com/shopify-app/mention-me-logo.svg" />
                        </InlineLayout>
                    </View>
                </BlockStack>
            </Modal>
        </ErrorBoundary>
    );
};
