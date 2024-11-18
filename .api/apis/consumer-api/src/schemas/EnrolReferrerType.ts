import AddressForSegmentationType from './AddressForSegmentationType.js';
import EnrolCustomerType from './EnrolCustomerType.js';
import OrderType from './OrderType.js';
import RequestWithVariationType from './RequestWithVariationType.js';

const EnrolReferrerType = {
  "required": [
    "customer",
    "request"
  ],
  "properties": {
    "customer": {
      "title": "Customer",
      "description": "Information about the referrer to enrol",
      "oneOf": [
        EnrolCustomerType
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
      "description": "Information about the address of the customer, for segmentation",
      "oneOf": [
        AddressForSegmentationType
      ]
    }
  },
  "type": "object",
  "title": "EnrolReferrerType",
  "x-readme-ref-name": "EnrolReferrerType"
} as const;
export default EnrolReferrerType
