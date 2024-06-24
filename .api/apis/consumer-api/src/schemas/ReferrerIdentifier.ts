import Offer from './Offer.js';

const ReferrerIdentifier = {
  "properties": {
    "referrerMentionMeIdentifier": {
      "title": "Our identifier for the referrer identified, the customer ID",
      "type": "integer"
    },
    "referrerToken": {
      "title": "Token used to identify the referrer uniquely\n(flowId)",
      "type": "string"
    },
    "referrerOfferIdentifier": {
      "title": "Identify the Offer (i.e. this is an Offer Id)",
      "type": "integer"
    },
    "offer": {
      "title": "Description of the offer and rewards which this referrer is able to offer",
      "oneOf": [
        Offer
      ]
    }
  },
  "type": "object",
  "title": "ReferrerIdentifier",
  "x-readme-ref-name": "ReferrerIdentifier"
} as const;
export default ReferrerIdentifier
