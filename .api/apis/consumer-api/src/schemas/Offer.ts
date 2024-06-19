import Reward from './Reward.js';

const Offer = {
  "properties": {
    "id": {
      "title": "The identifier of the offer.",
      "type": "integer"
    },
    "localeCode": {
      "title": "The locale code of the Offer.",
      "type": "string"
    },
    "headline": {
      "title": "The headline description for the Offer.",
      "description": "e.g. \"You can get a £20 gift card if you refer a friend to ...\"",
      "type": "string"
    },
    "description": {
      "title": "The details of the Offer.",
      "description": "e.g. \"Give your friends a 20% off introductory offer\"",
      "type": "string"
    },
    "callToAction": {
      "title": "The callToAction text of the Offer - typically goes on the button of the offer",
      "description": "e.g. \"Get a £20 gift card\"",
      "type": "string"
    },
    "privacyNotice": {
      "title": "The privacyNotice text of the Offer - typically shown near the CTA if required by privacy regulation",
      "description": "e.g. \"Get a £20 gift card\"",
      "type": "string"
    },
    "privacyLink": {
      "title": "The URL to the Mention Me privacy policy - typically shown near the Privacy Notice.",
      "description": "e.g. \"https://mention-me.com/help/privacy_policy\"",
      "type": "string"
    },
    "referrerReward": {
      "title": "The explicit description of the Referrer Reward for the Referrer.",
      "oneOf": [
        Reward
      ]
    },
    "refereeReward": {
      "title": "The explicit description of the Referee reward for the Referrer.",
      "oneOf": [
        Reward
      ]
    }
  },
  "type": "object",
  "title": "Offer",
  "x-readme-ref-name": "Offer"
} as const;
export default Offer
