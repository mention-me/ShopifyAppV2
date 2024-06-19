const ReferralStats = {
  "properties": {
    "successfulReferrals": {
      "title": "Number of successful referrals",
      "type": "integer"
    },
    "invitations": {
      "title": "Number of invitations made",
      "type": "integer"
    },
    "clicksOnInvites": {
      "title": "Number of clicks on invites",
      "type": "integer"
    }
  },
  "type": "object",
  "title": "ReferralStats",
  "x-readme-ref-name": "ReferralStats"
} as const;
export default ReferralStats
