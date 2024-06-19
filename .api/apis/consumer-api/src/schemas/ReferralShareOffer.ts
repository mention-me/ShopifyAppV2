import Offer from './Offer.js';
import ShareLink from './ShareLink.js';
import TermsLinks from './TermsLinks.js';

const ReferralShareOffer = {
  "properties": {
    "offer": {
      "title": "Description of the offer and rewards.",
      "oneOf": [
        Offer
      ]
    },
    "shareLinks": {
      "title": "List of share links for different share mechanisms.",
      "type": "array",
      "items": ShareLink
    },
    "termsLinks": {
      "title": "Links to the terms and conditions for this offer.",
      "oneOf": [
        TermsLinks
      ]
    }
  },
  "type": "object",
  "title": "ReferralShareOffer",
  "x-readme-ref-name": "ReferralShareOffer"
} as const;
export default ReferralShareOffer
