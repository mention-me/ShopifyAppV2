import ContentCollectionLink from './ContentCollectionLink.js';
import ReferrerIdentifier from './ReferrerIdentifier.js';
import TermsLinks from './TermsLinks.js';

const ReferrerFound = {
  "properties": {
    "referrer": {
      "title": "The primary payload of the response, assuming we found the referrer successfully. If we didn't this will be empty.",
      "oneOf": [
        ReferrerIdentifier
      ]
    },
    "foundMultipleReferrers": {
      "title": "Whether the user should be prompted to narrow the search (by entering an email address for example)",
      "type": "boolean"
    },
    "links": {
      "title": "Pagination of output and links to associated resources, including content-collection items.",
      "description": "TODO: This is overcomplicated. We should just call it \"content\" and return content!",
      "type": "array",
      "items": ContentCollectionLink
    },
    "termsLinks": {
      "title": "Links to the terms and conditions for this offer.",
      "oneOf": [
        TermsLinks
      ]
    },
    "meta": {
      "title": "This is used to hold a meta status code which is then used to pass a response back to the actual response later.",
      "type": "object",
      "additionalProperties": true
    }
  },
  "type": "object",
  "title": "ReferrerFound",
  "x-readme-ref-name": "ReferrerFound"
} as const;
export default ReferrerFound
