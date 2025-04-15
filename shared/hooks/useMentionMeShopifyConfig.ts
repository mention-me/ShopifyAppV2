import { Environment, getDomainForEnvironment } from "../utils";
import { APP_VERSION } from "../constants";
import { ExtensionType } from "../types";
import * as Sentry from "@sentry/react";
import { useQuery } from "@tanstack/react-query";

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
    orderTotalTrackingType?: string;
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
    Sentry.setTag("extensionLanguage", extensionLanguage);
    Sentry.setTag("language", language);
    Sentry.setTag("currency", currency);
    Sentry.setTag("country", country);
    Sentry.setTag("market", marketId);
    Sentry.setTag("marketHandle", marketHandle);
    Sentry.setTag("extension", extension);

    const { isPending, data } = useQuery<MentionMeShopifyConfig>({
        queryKey: [
            "shopifyConfig",
            {
                myshopifyDomain,
                extension,
                extensionLanguage,
                language,
                currency,
                country,
                marketId,
                marketHandle,
            },
        ],
        queryFn: async (): Promise<MentionMeShopifyConfig> => {
            const url = getDomainForEnvironment(myshopifyDomain, "production");

            const u = new URL(`https://${url}/shopify/app/config/${myshopifyDomain}`);
            u.searchParams.append("extensionLanguage", extensionLanguage);
            u.searchParams.append("language", language);
            u.searchParams.append("currency", currency);
            u.searchParams.append("country", country);
            u.searchParams.append("market", marketId);
            u.searchParams.append("marketHandle", marketHandle);
            u.searchParams.append("extension", extension);
            u.searchParams.append("version", APP_VERSION);

            const res = await fetch(u.toString(), {
                method: "GET",
                // mode: "no-cors",
                headers: { accept: "application/json" },
            });

            return (await res.json()) as MentionMeShopifyConfig;
        },
        // https://tkdodo.eu/blog/react-query-error-handling#error-boundaries
        throwOnError: true,
    });

    if (data) {
        Sentry.setTag("shopId", data.shopId);
        Sentry.setTag("locale", data.defaultLocale);
        Sentry.setTag("environment", data.environment);
        Sentry.setTag("defaultLocale", data.defaultLocale);
    }

    return {
        loading: isPending,
        mentionMeConfig: data,
    };
};
