import type * as types from './types.js';
import type { ConfigOptions, FetchResponse } from '@readme/api-core/types';
import APICore from '@readme/api-core';
import definition from '../openapi.json';

export default class SDK {
  core: APICore;

  constructor() {
    this.core = new APICore(definition, 'mention-me/v2 (api/7.0.0-beta.7)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Provide a customers' details so we can tell you if we could enrol them into an offer.
   * We'll provide the URL to the web-view for their journey.
   *
   * Given a set of input parameters about the customer (and segment and any order that has
   * just taken place), decide if we could enrol them as a customer and if so, give you a
   * link to the web view so they can share the offer - whether referral, IFA or NPS - with
   * their friends.
   *
   * We encourage you to include the details of any order which has just taken place as this
   * helps us with segmentation and propensity modelling. You can tell us about orders
   * separately too.
   *
   * You can present this as a button, link or broader display panel. We include other useful
   * content which you can choose to present to the customer to give them a richer invitation
   * to join the promotion
   * programme. A headline and description describe the offer and the default CTA text gives
   * you content to add to the link or button. There is also an optional image URL. There is
   * also an optional privacy information notice if you need it.
   *
   * Users of the Mention Me platform can configure and edit the content and image returned
   * and those can be AB tested also - for example half the customers see one image and one
   * set of content and half see another so that you can test how offers perform.
   *
   * Note: you can also use `/api/entry-point/{version}/referrer` as the endpoint, which is
   * an alias of this path
   *
   * @summary Enrol a customer in an offer
   */
  post_api_entry_point_offer(body: types.EntryPointForReferrerType, metadata: types.PostApiEntryPointOfferMetadataParam): Promise<FetchResponse<200, types.EntryPointOfferAndLink>> {
    return this.core.fetch('/api/entry-point/{version}/offer', 'post', body, metadata);
  }

  /**
   * Provide some details of a referee (optional - if you have them) and some context (such
   * as locale) so we can tell you if we can serve a name finder journey. We'll provide the
   * URL to the web-view for their journey.
   *
   * Given a set of input parameters about the referee (and segment etc), decide if we could
   * serve them a referee
   * name finder journey and give them a link to the web view for doing that.
   *
   * If you choose to direct the consumer to the URL via an iframe, the closing of the
   * journey and the fulfillment of any coupon is done via postMessage. If you send the
   * consumer to the URL they will close the flow using the browser itself and the CTA at the
   * end is the defined CTA URL to take them to the next step of their journey.
   *
   * @summary Find a friend by name
   */
  post_api_entry_point_referee(body: types.EntryPointForRefereeType, metadata: types.PostApiEntryPointRefereeMetadataParam): Promise<FetchResponse<200, types.EntryPointLink>> {
    return this.core.fetch('/api/entry-point/{version}/referee', 'post', body, metadata);
  }

  /**
   * Provide a customers' details so we can tell you if we could show them a dashboard (or
   * offer). We'll provide the URL to the web-view for their dashboard.
   *
   * Provide their full details (name, email, customerId) if you want us to optionally
   * register them if they're not yet a referrer.
   *
   * @summary Get dashboard
   */
  post_api_entry_point_dashboard(body: types.EntryPointForDashboardType, metadata: types.PostApiEntryPointDashboardMetadataParam): Promise<FetchResponse<200, types.EntryPointLink>> {
    return this.core.fetch('/api/entry-point/{version}/dashboard', 'post', body, metadata);
  }
}
