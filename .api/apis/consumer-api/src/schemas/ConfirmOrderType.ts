import AddressType from './AddressType.js';
import CustomerType from './CustomerType.js';
import OrderType from './OrderType.js';
import RequestType from './RequestType.js';

const ConfirmOrderType = {
  "required": [
    "order",
    "customer",
    "request"
  ],
  "properties": {
    "order": {
      "title": "Order",
      "description": "Information about the order which took place",
      "oneOf": [
        OrderType
      ]
    },
    "customer": {
      "title": "Customer",
      "description": "Information about the customer who placed the order",
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
    },
    "address": {
      "title": "Address",
      "description": "Information about the address of the customer who placed the order",
      "oneOf": [
        AddressType
      ]
    }
  },
  "type": "object",
  "title": "ConfirmOrderType",
  "x-readme-ref-name": "ConfirmOrderType"
} as const;
export default ConfirmOrderType
