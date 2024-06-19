const ShareLink = {
  "properties": {
    "type": {
      "title": "The type of share mechanism (e.g. Facebook, Twitter, Open link, Email link)",
      "type": "string"
    },
    "protocol": {
      "title": "The protocol (if available) for the share",
      "type": "string"
    },
    "url": {
      "title": "The url to include in the share",
      "type": "string"
    },
    "defaultShareMessage": {
      "title": "The default message to include in the share",
      "type": "string"
    },
    "exampleImplementation": {
      "title": "An example of the share URL you could use to initiate this share.",
      "description": "You are free to implement this your own way if you wish",
      "type": "string"
    }
  },
  "type": "object",
  "title": "ShareLink",
  "x-readme-ref-name": "ShareLink"
} as const;
export default ShareLink
