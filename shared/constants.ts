export const APP_VERSION = "UNKNOWN";
export const APP_NAME = "mention-me-shopify-app";
/**
 * Shopify doesn't work with cookies, so we need a way to identify if someone is in test/debug mode or not.
 * In the InjectionConfiguration code in the API controllers we look for this special constant and allow the integration
 * to work if this string exists.
 *
 * See: src/Nora/ReferralBundle/Service/IntegrationIsAvailableService.php
 */
export const SHOPIFY_PREVIEW_MODE_FLAG: string = "shopify-preview-mode";

