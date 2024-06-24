import SDK from './sdk.js';

/**
 * Entry Point API
 *
 * Add links or buttons to your App which take customers into a hosted web view to allow
 * them to refer their friends or become referred.
 *
 * @see {@link https://mention-me.com/help/tnc_f/site Terms of Service}
 */
const createSDK = (() => { return new SDK(); })();

export default createSDK;
