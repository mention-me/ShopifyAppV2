import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { Environment } from "../../../../shared/utils";
import { MentionMeShopifyConfig } from "../../../../shared/hooks/useMentionMeShopifyConfig";
import { useSettings } from "@shopify/ui-extensions-react/checkout";

type ImageLocation = "Top" | "Above information notice" | "Above CTA" | "Below CTA";

type ReferrerJourneyState = {
    imageLocation: ImageLocation;
    orderId: string;
    partnerCode: string;
    environment: Environment;
    defaultLocale: string;
    localeChoiceMethod: string;
    orderTotalTrackingType: string;
    errorState: boolean;
    setErrorState: Dispatch<SetStateAction<boolean>>;
};

export const ReferrerJourneyContext = createContext<ReferrerJourneyState>(undefined);

interface Props {
    readonly imageLocation: ImageLocation | null;
    readonly orderId: string;
    readonly mentionMeConfig: MentionMeShopifyConfig;
    readonly children: ReactNode;
}

export const ReferrerJourneyProvider = ({ imageLocation, orderId, mentionMeConfig, children }: Props) => {
    const [errorState, setErrorState] = useState<boolean>(false);

    const state = useMemo(() => {
        const { partnerCode, environment, defaultLocale, localeChoiceMethod, orderTotalTrackingType } = mentionMeConfig;

        return {
            imageLocation: imageLocation ?? "Top",
            orderId,
            partnerCode,
            environment,
            defaultLocale,
            localeChoiceMethod,
            orderTotalTrackingType,
            errorState,
            setErrorState,
        };
    }, [imageLocation, orderId, mentionMeConfig, errorState]);

    return <ReferrerJourneyContext.Provider value={state}>{children}</ReferrerJourneyContext.Provider>;
};
