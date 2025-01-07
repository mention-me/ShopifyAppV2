import { Environment, getDomainForEnvironment } from "../utils";
import { useEffect, useState } from "react";
import { APP_VERSION } from "../constants";
import { ExtensionType } from "../types";
import * as Sentry from "@sentry/react";

export interface Image {
    url: string;
    width: number;
    height: number;
}

export interface MentionMeShopifyConfig {
    shopId?: string;
    environment?: Environment;
    partnerCode?: string;
    defaultLocale?: string;
    localeChoiceMethod?: string;
    refereeBannerImage?: Image;
}

interface Props {
    myshopifyDomain: string;
    extension: ExtensionType;
    currency: string;
    extensionLanguage: string;
    language: string;
    country?: string;
    marketId?: string;
    marketHandle?: string;
}

export const useMentionMeShopifyConfig = ({
    myshopifyDomain,
    extension,
    extensionLanguage,
    language,
    currency,
    country,
    marketId,
    marketHandle,
}: Props) => {
    const [mentionMeConfig, setMentionMeConfig] = useState<MentionMeShopifyConfig>({
        shopId: undefined,
        partnerCode: "",
        environment: null,
        defaultLocale: "",
    });

    useEffect(() => {
        Sentry.setTag("extensionLanguage", extensionLanguage);
        Sentry.setTag("language", language);
        Sentry.setTag("currency", currency);
        Sentry.setTag("country", country);
        Sentry.setTag("market", marketId);
        Sentry.setTag("marketHandle", marketHandle);
        Sentry.setTag("extension", extension);

        if (mentionMeConfig?.shopId) {
            Sentry.setTag("shopId", mentionMeConfig.shopId);
            Sentry.setTag("locale", mentionMeConfig.defaultLocale);
            Sentry.setTag("environment", mentionMeConfig.environment);
            Sentry.setTag("defaultLocale", mentionMeConfig.defaultLocale);
        }
    }, [country, currency, extension, extensionLanguage, language, marketHandle, marketId, mentionMeConfig]);

    const [loading, setLoading] = useState(true);

    const url = getDomainForEnvironment(myshopifyDomain, "production");

    useEffect(() => {
        const fetchMentionMeConfig = async () => {
            const u = new URL(`https://${url}/shopify/app/config/${myshopifyDomain}`);
            u.searchParams.append("extensionLanguage", extensionLanguage);
            u.searchParams.append("language", language);
            u.searchParams.append("currency", currency);
            u.searchParams.append("country", country);
            u.searchParams.append("market", marketId);
            u.searchParams.append("marketHandle", marketHandle);
            u.searchParams.append("extension", extension);
            u.searchParams.append("version", APP_VERSION);

            try {
                const response = await fetch(u.toString(), {
                    method: "GET",
                    // mode: "no-cors",
                    headers: { accept: "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Could not retrieve config for shop");
                }

                const json = (await response.json()) as MentionMeShopifyConfig;

                setMentionMeConfig(json);
                setLoading(false);
            } catch (error) {
                throw new Error("Caught exception trying to retrieve config for shop");
            }
        };

        fetchMentionMeConfig();
    }, [country, currency, extension, extensionLanguage, language, marketHandle, marketId, myshopifyDomain, url]);

    return {
        loading,
        mentionMeConfig,
    };
};
