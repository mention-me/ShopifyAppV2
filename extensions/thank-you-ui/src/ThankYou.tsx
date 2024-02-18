import {
    BlockLayout,
    Button,
    Image,
    Link,
    View,
    useApi,
    useLanguage,
    useLocalizationCountry,
    useSettings,
    reactExtension,
} from "@shopify/ui-extensions-react/checkout";

import { useEffect, useState } from "react";

export default reactExtension("purchase.thank-you.block.render", () => <Extension />);

function Extension() {
    const { extension } = useApi();

    const [apiResponse, setApiResponse] = useState();

    /*
     * This will only be set when in real deployment
     * TODO(EHG): Figure out what to do when we don't
     * have this - i.e. can we check "if dev?"
     */
    let { mmPartnerCode } = useSettings();

    const language = useLanguage();
    // const country = useLocalizationCountry();

    // console.log("language", language);
    // console.log("country", country);

    useEffect(() => {
        if (!mmPartnerCode) {
            mmPartnerCode = "mmf1c1195b";
            // console.log("Partner code not set");
            // return;
        }

        fetchReferrerEntryPoint(mmPartnerCode, language.isoCode.replace("-", "_"), setApiResponse);
    }, [fetchReferrerEntryPoint, mmPartnerCode, language, setApiResponse]);

    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (apiResponse && apiResponse.url && apiResponse.defaultCallToAction) {
            setVisible(true);
            console.log(apiResponse);
        }
    }, [setVisible, apiResponse]);

    return (
        visible && (
            <BlockLayout rows={[60, "fill"]}>
                <View blockAlignment="center">
                    <Button external={true} to={apiResponse.url}>
                        {apiResponse.defaultCallToAction}
                    </Button>
                </View>
                <View>
                    {apiResponse.imageUrl && (
                        <Link external={true} to={apiResponse.url}>
                            <Image source={apiResponse.imageUrl} />
                        </Link>
                    )}
                </View>
            </BlockLayout>
        )
    );
}

function fetchReferrerEntryPoint(mmPartnerCode: string, locale: string, setApiResponse: React.Dispatch) {
    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            customer: {
                emailAddress: "customer@example.com",
            },
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

    fetch("https://demo.mention-me.com/api/entry-point/v2/referrer", options)
        .then((response) => response.json())
        .then((json) => setApiResponse(json));
}
