const CustomerType = {
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
    }
  },
  "type": "object",
  "title": "CustomerType",
  "x-readme-ref-name": "CustomerType"
} as const;
export default CustomerType
