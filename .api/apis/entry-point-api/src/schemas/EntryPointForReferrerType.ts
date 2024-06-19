import AddressForSegmentationType from './AddressForSegmentationType.js';
import CustomerType from './CustomerType.js';
import ImplementationType from './ImplementationType.js';
import OrderType from './OrderType.js';
import RequestWithVariationType from './RequestWithVariationType.js';

const EntryPointForReferrerType = {
  "required": [
    "customer",
    "request"
  ],
  "properties": {
    "customer": {
      "title": "Customer",
      "description": "Information about the referrer",
      "oneOf": [
        CustomerType
      ]
    },
    "request": {
      "title": "Request",
      "description": "Information about the request",
      "oneOf": [
        RequestWithVariationType
      ]
    },
    "order": {
      "title": "Order",
      "description": "Information about the order (used for recording order events AND segmentation)",
      "oneOf": [
        OrderType
      ]
    },
    "address": {
      "title": "Address",
      "description": "Information about the address of the customer (used for segmentation)",
      "oneOf": [
        AddressForSegmentationType
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
  "title": "EntryPointForReferrerType",
  "x-readme-ref-name": "EntryPointForReferrerType"
} as const;
export default EntryPointForReferrerType
