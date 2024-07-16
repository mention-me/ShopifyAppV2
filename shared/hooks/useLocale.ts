interface Props {
	shopifyLanguage: string;
	defaultLocale: string;
}

const useLocale = ({ shopifyLanguage, defaultLocale }: Props) => {
	const language = shopifyLanguage.replace("-", "_");

	if (language.length === 5 && /^[a-z]{2}_[a-z]{2}$/i.test(language)) {
		return language;
	}

	if (typeof defaultLocale === "string" && defaultLocale.length === 5 && /^[a-z]{2}_[a-z]{2}$/i.test(defaultLocale)) {
		return defaultLocale;
	}

	return undefined;
}

export default useLocale;
