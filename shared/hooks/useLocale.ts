const isValidLocale = (locale: string) => {
    return locale.length === 5 && /^[a-z]{2}_[a-z]{2}$/i.test(locale);
};

/**
 * Sometimes "shopifyLanguageOrLocale", which comes from `useLanguage` hook will return only two characters (e.g. "en" or "fr").
 *
 * If languageOrLocale is only two characters, we'll try appending the country code to it.
 *
 * @param shopifyLanguageOrLocale
 * @param shopifyCountry
 * @param defaultLocale
 * @param localeChoiceMethod
 */
const useLocale = (
    shopifyLanguageOrLocale: string,
    shopifyCountry: string | undefined,
    defaultLocale: string,
    localeChoiceMethod: string
) => {
    if (localeChoiceMethod === "forced") {
        return defaultLocale;
    }

    // Otherwise, Shopify gets to decide the locale

    const language = shopifyLanguageOrLocale.replace("-", "_");

    if (isValidLocale(language)) {
        return language;
    }

    // The shopifyLanguageOrLocale isn't a valid locale. If the language + country code is, let's use that instead.
    if (shopifyCountry) {
        const locale = `${language}_${shopifyCountry}`;
        if (isValidLocale(locale)) {
            return locale;
        }
    }

    // This wasn't a valid locale either - so let's return the default.
    // An example we've seen where it isn't valid is where the country is "undefined".
    if (typeof defaultLocale === "string" && isValidLocale(defaultLocale)) {
        return defaultLocale;
    }

    return undefined;
};

export default useLocale;
