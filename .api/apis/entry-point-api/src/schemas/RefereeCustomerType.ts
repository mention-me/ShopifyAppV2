const RefereeCustomerType = {
  "properties": {
    "emailAddress": {
      "description": "Customer email address",
      "type": "string",
      "examples": [
        ""
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
    }
  },
  "type": "object",
  "title": "RefereeCustomerType",
  "x-readme-ref-name": "RefereeCustomerType"
} as const;
export default RefereeCustomerType
