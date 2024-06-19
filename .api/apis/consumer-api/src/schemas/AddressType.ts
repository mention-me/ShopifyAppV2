const AddressType = {
  "properties": {
    "addressLine1": {
      "description": "First line of address",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "addressLine2": {
      "description": "Second line of address",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "addressCity": {
      "description": "City part of address",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "addressCounty": {
      "description": "County or state part of address",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "addressPostCode": {
      "description": "Post or ZIP code",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "addressCountry": {
      "description": "Country of address",
      "type": "string",
      "examples": [
        ""
      ]
    }
  },
  "type": "object",
  "title": "AddressType",
  "x-readme-ref-name": "AddressType"
} as const;
export default AddressType
