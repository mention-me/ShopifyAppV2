import type * as types from './types.js';
import type { ConfigOptions, FetchResponse } from '@readme/api-core/types';
import APICore from '@readme/api-core';
import definition from '../openapi.json';

export default class SDK {
  core: APICore;

  constructor() {
    this.core = new APICore(definition, 'consumer-api/v2 (api/7.0.0-beta.8)');
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
   * Tell us that an order took place so that we can reward any appropriate referrer, track
   * the order and optimise the performance of the referral scheme.
   *
   *
   * We'll transform the request in to something that the existing tag persister can
   * understand.
   *
   * @summary Record order
   */
  post_api_order(body: types.ConfirmOrderType, metadata: types.PostApiOrderMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/consumer/{version}/order', 'post', body, metadata);
  }

  /**
   * Tell us about a customer (and any related order and segmentation details) to enrol them
   * as a referrer and receive an offer to share with them
   *
   * @summary Enrol referrer
   */
  post_api_referrer_enrol(body: types.EnrolReferrerType, metadata: types.PostApiReferrerEnrolMetadataParam): Promise<FetchResponse<200, types.ReferralShareOffer>> {
    return this.core.fetch('/api/consumer/{version}/referrer/enrol', 'post', body, metadata);
  }

  /**
   * Get a referrer's dashboard (given a referrer identity, get their dashboard data).
   *
   * If we respond with a 404 they are not a referrer. Instead, you should Enrol them as a
   * referrer first, then call this endpoint again.
   *
   * @summary Get dashboard
   */
  get_api_referrer_dashboard(metadata: types.GetApiReferrerDashboardMetadataParam): Promise<FetchResponse<200, types.ReferralDashboardOffer>> {
    return this.core.fetch('/api/consumer/{version}/referrer/dashboard', 'get', metadata);
  }

  /**
   * Fetch details from Mention Me with which to build a "find a friend" page. This will
   * include an initial CTA, such as "Been referred by a friend?" as well as specific content
   * which you can use to build the page.
   *
   * Using this API to build your content will allow you to keep your content up to date with
   * the latest content managed in Mention Me.
   *
   * You should call this API once when your page is loaded, e.g. on the checkout page, and
   * use it to populate the page.
   *
   * @summary Find a friend content
   */
  get_api_name_search_content(metadata: types.GetApiNameSearchContentMetadataParam): Promise<FetchResponse<200, types.RefereeContent>> {
    return this.core.fetch('/api/consumer/{version}/referrer/search/content', 'get', metadata);
  }

  /**
   * Search for a referrer to connect to a referee, just using the referrer's name, entered
   * by the referee. If we don't have an exact match for the referrer's name we'll respond
   * with a 404 or 400. The referee can change the name and/or enter an email address of the
   * referrer to find an exact match.
   *
   * In a non-exact match we will not return a payload response and we'll also set the
   * `foundMultipleReferrers` parameter in the root of the response, to indicate that the
   * search needs to be narrowed (i.e. ask for an email address or possibly prompt for a more
   * verbose name). The exact narrowing strategy is up to the client.
   *
   * If there is no payload and no foundMultipleReferrers set, the client should prompt for a
   * fresh search.
   *
   * When an exact match is found, the payload contains the customer ID, flow token and the
   * offer.
   *
   * @summary Find a friend
   */
  get_api_name_search(metadata: types.GetApiNameSearchMetadataParam): Promise<FetchResponse<200, types.ReferrerFound>> {
    return this.core.fetch('/api/consumer/{version}/referrer/search', 'get', metadata);
  }

  /**
   * Post a referee's details to register them as a referee after successfully finding a
   * referrer to link them to.
   *
   * @summary Register referee
   */
  post_api_register_referee(body: types.EnrolRefereeType, metadata: types.PostApiRegisterRefereeMetadataParam): Promise<FetchResponse<200, types.RefereeRegister>> {
    return this.core.fetch('/api/consumer/{version}/referee/register', 'post', body, metadata);
  }
}
