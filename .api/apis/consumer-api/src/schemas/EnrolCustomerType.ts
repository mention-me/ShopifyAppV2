const EnrolCustomerType = {
  "required": [
    "emailAddress",
    "firstname",
    "surname"
  ],
  "properties": {
    "emailAddress": {
      "description": "Customer email address",
      "type": "string",
      "examples": [
        "jane.doe@example.com"
      ]
    },
    "title": {
      "description": "Customer title such as Mr, Miss, Dr or Sir",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "firstname": {
      "description": "Customer firstname",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "surname": {
      "description": "Customer surname",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "uniqueIdentifier": {
      "description": "Your unique identifier for this customer e.g. CustomerId",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "segment": {
      "description": "Customer segment - a string containing segment data about this customer, e.g. vip or employee. You can concatenate multiple segments together if you wish using hyphens.",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "customField": {
      "description": "Custom field - a string containing custom data about this customer, e.g. SEGMENT001 or Package B",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "hasEngaged": {
      "description": "Has this customer been informed of their privacy rights, and actively engaged in the offer? Mention Me expects you to set this as false when you first show the offer, and true when someone has actively engaged, e.g. after clicking a call to action. If no value is provided, we will use the default defined on the offer.",
      "type": "boolean",
      "examples": [
        false
      ]
    }
  },
  "type": "object",
  "title": "EnrolCustomerType",
  "x-readme-ref-name": "EnrolCustomerType"
} as const;
export default EnrolCustomerType
