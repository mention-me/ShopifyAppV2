import {
    Link,
    useApi,
    useLanguage,
    useLocalizationCountry,
    useSettings,
    reactExtension,
} from "@shopify/ui-extensions-react/checkout";

import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => <Extension />);

function Extension() {
    const { extension } = useApi();

    const [apiResponse, setApiResponse] = useState();

    /*
     * This will only be set when in real deployment
     * TODO(EHG): Figure out what to do when we don't
     * have this - i.e. can we check "if dev?"
     */
    const { mmPartnerCode } = useSettings();

    const language = useLanguage();
    // const country = useLocalizationCountry();

    // console.log("language", language);
    // console.log("country", country);

    useEffect(() => {
        if (!mmPartnerCode) {
            console.log("Partner code not set");
            return;
        }

        fetchRefereeEntryPoint(mmPartnerCode, language.isoCode.replace("-", "_"), setApiResponse);
    }, [fetchRefereeEntryPoint, mmPartnerCode, language, setApiResponse]);

    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (apiResponse && apiResponse.url && apiResponse.defaultCallToAction) {
            setVisible(true);
        }
    }, [setVisible, apiResponse]);

    return (
        visible && (
            <Link external={true} to={apiResponse.url}>
                {apiResponse.defaultCallToAction}
            </Link>
        )
    );
}

function fetchRefereeEntryPoint(mmPartnerCode: string, locale: string, setApiResponse: React.Dispatch) {
    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            request: {
                partnerCode: mmPartnerCode,
                situation: "shopify-checkout",
                appVersion: "v1",
                appName: "mention-me-shopify-app",
                localeCode: locale,
            },
            implementation: {
                wrapContentWithBranding: true,
                showCloseIcon: false,
            },
        }),
    };

    fetch("https://demo.mention-me.com/api/entry-point/v2/referee", options)
        .then((response) => response.json())
        .then((json) => setApiResponse(json));
}
