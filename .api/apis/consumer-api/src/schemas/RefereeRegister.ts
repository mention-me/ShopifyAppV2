import ContentCollectionLink from './ContentCollectionLink.js';
import Offer from './Offer.js';
import RefereeReward from './RefereeReward.js';
import TermsLinks from './TermsLinks.js';

const RefereeRegister = {
  "properties": {
    "offer": Offer,
    "refereeReward": {
      "title": "A description of the referee reward for the Referee",
      "oneOf": [
        RefereeReward
      ]
    },
    "content": ContentCollectionLink,
    "termsLinks": {
      "title": "Links to the terms and conditions for this offer.",
      "oneOf": [
        TermsLinks
      ]
    },
    "status": {
      "type": "string"
    }
  },
  "type": "object",
  "title": "RefereeRegister",
  "x-readme-ref-name": "RefereeRegister"
} as const;
export default RefereeRegister
