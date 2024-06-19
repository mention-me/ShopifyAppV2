const RefereeReward = {
  "properties": {
    "description": {
      "title": "Description of the reward",
      "type": "string"
    },
    "couponCode": {
      "title": "Reward coupon code (if appropriate)",
      "type": "string"
    },
    "securityCode": {
      "title": "Reward security code (if appropriate)",
      "type": "string"
    },
    "url": {
      "title": "Reward link (if appropriate)",
      "type": "string"
    },
    "amount": {
      "title": "The reward amount - note this is not always a number. It can be a currency amount, a percentage, a number (of items) or a text description depending on the reward type.",
      "type": "string"
    }
  },
  "type": "object",
  "title": "RefereeReward",
  "x-readme-ref-name": "RefereeReward"
} as const;
export default RefereeReward
