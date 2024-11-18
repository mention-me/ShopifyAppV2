const EntryPointOfferAndLink = {
  "properties": {
    "url": {
      "title": "The url to include in the share",
      "type": "string"
    },
    "defaultCallToAction": {
      "title": "The default message to include as the CTA",
      "type": "string"
    },
    "localeCode": {
      "title": "The locale code of the Offer - the locale in which the content is presented",
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
    "privacyNotice": {
      "title": "The privacyNotice text of the Offer - typically shown near the CTA if required by privacy regulation",
      "description": "e.g. \"Our refer-a-friend programme is managed by Mention Me who will process your data and send you referral service emails.\"",
      "type": "string"
    },
    "privacyNoticeUrl": {
      "title": "The Mention Me privacy policy URL.",
      "type": "string"
    },
    "privacyNoticeLinkText": {
      "title": "The text to use for linking to $privacyNoticeUrl.",
      "type": "string"
    },
    "imageUrl": {
      "title": "The URL to an image for the Offer.",
      "type": "string"
    },
    "offerCode": {
      "title": "The code which identifies the offer we picked (which could be used for the client to style the placement differently). It is the QuickLinkCode of the Offer.",
      "type": "string"
    }
  },
  "type": "object",
  "title": "EntryPointOfferAndLink",
  "x-readme-ref-name": "EntryPointOfferAndLink"
} as const;
export default EntryPointOfferAndLink
