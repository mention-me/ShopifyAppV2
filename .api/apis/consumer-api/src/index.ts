import SDK from './sdk.js';

/**
 * Consumer API
 *
 * Create your own front end for the referral journey using our Consumer API.
 *
 * @see {@link https://mention-me.com/help/tnc_f/site Terms of Service}
 */
const createSDK = (() => { return new SDK(); })();

export default createSDK;
