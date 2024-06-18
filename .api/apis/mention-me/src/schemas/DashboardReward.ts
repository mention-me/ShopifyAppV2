const DashboardReward = {
  "properties": {
    "description": {
      "title": "Friendly description of a reward for the intended recipient.",
      "description": "The description we give may vary depending on the point in the flow that we choose to give it. Note that in some cases this might be \"promising the reward\" and in other cases \"giving it\".\n\ne.g. \"You'll get £20 for each friend you refer\" e.g. \"Your friends get a free camera when they order for the first time\" e.g. \"A 20% discount code\"",
      "type": "string"
    },
    "summary": {
      "title": "Summary - now deprecated - it serves no purpose over and above the description.",
      "type": "string"
    },
    "amount": {
      "title": "The reward amount - now deprecated (because rewards don't have a consistent amount - some have text, percentage, number. Use the description to describe the reward.",
      "type": "string"
    },
    "status": {
      "title": "Status of the reward eg Pending, Cancelled, Given by email",
      "type": "string"
    },
    "forReferring": {
      "title": "Description of who they referred to get the reward. As this could be multiple people, it's an array.",
      "type": "object",
      "additionalProperties": true
    }
  },
  "type": "object",
  "title": "DashboardReward",
  "x-readme-ref-name": "DashboardReward"
} as const;
export default DashboardReward
