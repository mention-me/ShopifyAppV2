const RefereeContent = {
  "properties": {
    "entryCta": {
      "title": "The Call to Action the user uses to start the journey.",
      "description": "e.g. \"Been referred by a friend?\"",
      "type": "string"
    },
    "headline": {
      "title": "A headline to display to users when they open the NameSearch journey.",
      "description": "e.g. \"Who referred you to us?\"",
      "type": "string"
    },
    "searchText": {
      "title": "A headline to display to users when they open the NameSearch journey.",
      "description": "e.g. \"Enter your friends name so we can thank them for referring you to us.\"",
      "type": "string"
    },
    "searchCta": {
      "title": "The Call to Action on the button.",
      "description": "e.g. \"Find them\"",
      "type": "string"
    },
    "nameInputPlaceholder": {
      "title": "A placeholder string to display in the name input field.",
      "description": "e.g. \"Your friend's name\"",
      "type": "string"
    },
    "emailInputPlaceholder": {
      "title": "A placeholder string to display in the email input field.",
      "description": "e.g. \"Your friend's email\"",
      "type": "string"
    }
  },
  "type": "object",
  "title": "RefereeContent",
  "x-readme-ref-name": "RefereeContent"
} as const;
export default RefereeContent
