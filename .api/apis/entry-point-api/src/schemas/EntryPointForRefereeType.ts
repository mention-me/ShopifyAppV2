import ImplementationType from './ImplementationType.js';
import RefereeCustomerType from './RefereeCustomerType.js';
import RequestWithVariationType from './RequestWithVariationType.js';

const EntryPointForRefereeType = {
  "required": [
    "request"
  ],
  "properties": {
    "customer": {
      "title": "Referee",
      "description": "Information about the referee (if you have any)",
      "oneOf": [
        RefereeCustomerType
      ]
    },
    "request": {
      "title": "Request",
      "description": "Information about the request",
      "oneOf": [
        RequestWithVariationType
      ]
    },
    "implementation": {
      "title": "Implementation",
      "description": "Options for the implementation",
      "oneOf": [
        ImplementationType
      ]
    }
  },
  "type": "object",
  "title": "EntryPointForRefereeType",
  "x-readme-ref-name": "EntryPointForRefereeType"
} as const;
export default EntryPointForRefereeType
