import DashboardReward from './DashboardReward.js';
import Offer from './Offer.js';
import ReferralStats from './ReferralStats.js';
import ShareLink from './ShareLink.js';
import TermsLinks from './TermsLinks.js';

const ReferralDashboardOffer = {
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
    },
    "referralStats": {
      "title": "Referral Stats.",
      "oneOf": [
        ReferralStats
      ]
    },
    "referralRewards": {
      "title": "Referral rewards - list of potential rewards they are due for introducing customers.",
      "type": "array",
      "items": DashboardReward
    }
  },
  "type": "object",
  "title": "ReferralDashboardOffer",
  "x-readme-ref-name": "ReferralDashboardOffer"
} as const;
export default ReferralDashboardOffer
