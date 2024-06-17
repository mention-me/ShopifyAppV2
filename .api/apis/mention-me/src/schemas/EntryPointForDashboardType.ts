import CustomerType from './CustomerType.js';
import RequestWithAuthenticationType from './RequestWithAuthenticationType.js';

const EntryPointForDashboardType = {
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
      "description": "Information about the request, including authentication",
      "oneOf": [
        RequestWithAuthenticationType
      ]
    }
  },
  "type": "object",
  "title": "EntryPointForDashboardType",
  "x-readme-ref-name": "EntryPointForDashboardType"
} as const;
export default EntryPointForDashboardType
