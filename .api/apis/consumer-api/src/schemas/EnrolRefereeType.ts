import CustomerType from './CustomerType.js';
import RequestType from './RequestType.js';

const EnrolRefereeType = {
  "required": [
    "referrerMentionMeIdentifier",
    "referrerToken",
    "customer",
    "request"
  ],
  "properties": {
    "referrerMentionMeIdentifier": {
      "description": "Id representing the referrer returned by a successful name search",
      "type": "integer",
      "examples": [
        ""
      ]
    },
    "referrerToken": {
      "description": "Token representing the referrer returned by a successful name search",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "customer": {
      "title": "Customer",
      "description": "Information about the referee to register and give a reward",
      "oneOf": [
        CustomerType
      ]
    },
    "request": {
      "title": "Request",
      "description": "Information about the request",
      "oneOf": [
        RequestType
      ]
    }
  },
  "type": "object",
  "title": "EnrolRefereeType",
  "x-readme-ref-name": "EnrolRefereeType"
} as const;
export default EnrolRefereeType
