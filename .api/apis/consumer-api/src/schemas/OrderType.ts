const OrderType = {
  "required": [
    "orderIdentifier",
    "total",
    "currencyCode",
    "dateString"
  ],
  "properties": {
    "orderIdentifier": {
      "description": "Your Order Identifier for the transaction that has taken place",
      "type": "string",
      "examples": [
        "123456"
      ]
    },
    "total": {
      "description": "Order subtotal, excluding tax and shipping in the currency specified by currencyCode",
      "type": "string",
      "examples": [
        "100"
      ]
    },
    "currencyCode": {
      "description": "3 letter currency code for the currency in which the transaction took place",
      "type": "string",
      "examples": [
        "GBP"
      ]
    },
    "dateString": {
      "description": "The date on which the transaction took place (typically the current date/time). Use ISO8601 format (e.g. 2016-11-30T17:52:50Z)",
      "type": "string",
      "examples": [
        "2024-07-10T09:43:37+00:00"
      ]
    },
    "couponCode": {
      "description": "If a coupon was used in the transaction, the coupon code the consumer used",
      "type": "string",
      "examples": [
        "ABC23252"
      ]
    },
    "discountAmount": {
      "description": "The discount amount. Our assumption is this has already been taken off the order subtotal provided. This allows us to calculate the Cost Per Acquisition for referral.",
      "type": "string",
      "examples": [
        "12.44"
      ]
    },
    "orderItemCount": {
      "description": "The number of items in the order/cart (if applicable). This helps us understand the type of purchase and can be a signal of advocacy.",
      "type": "string",
      "examples": [
        "3"
      ]
    },
    "isSubscription": {
      "description": "Whether this order is for a subscription (recurring). This helps us qualify and categorise the revenue.",
      "type": "boolean",
      "examples": [
        ""
      ]
    },
    "isGift": {
      "description": "Whether this order is a gift (being bought for someone else). Gifts can be signals of advocacy.",
      "type": "boolean",
      "examples": [
        ""
      ]
    }
  },
  "type": "object",
  "title": "OrderType",
  "x-readme-ref-name": "OrderType"
} as const;
export default OrderType
