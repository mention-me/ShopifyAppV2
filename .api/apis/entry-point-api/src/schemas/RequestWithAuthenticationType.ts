const RequestWithAuthenticationType = {
  "required": [
    "partnerCode",
    "situation",
    "authenticationToken"
  ],
  "properties": {
    "partnerCode": {
      "description": "Your partner code, used to link to your users and offers",
      "type": "string",
      "examples": [
        "[YOUR-PARTNER-CODE]"
      ]
    },
    "situation": {
      "description": "Situation - a string representing where in the application you are making this request",
      "type": "string",
      "examples": [
        "mobile-app"
      ]
    },
    "localeCode": {
      "description": "Locale code - ISO standard locale code (e.g. en_GB) for the locale you expect the content to be in",
      "type": "string",
      "examples": [
        "en_GB"
      ]
    },
    "ipAddress": {
      "description": "IP address of the customer connection. If you're making a request on behalf of a customer, pass their IP address here. If the customer will connect directly, leave this empty and we will retrieve this from their request.",
      "type": "string",
      "examples": [
        "127.0.0.1"
      ]
    },
    "userDeviceIdentifier": {
      "description": "User Device Identifier should be a unique reference to this combination of app + user. We use this for de-duplication, reporting and anti-gaming. For example you could concatenate your CustomerId and a UniqueID representing the App Install and provide us with the hash. On Android the UniqueID could be an InstanceID or GUID. On iPhone the UniqueID should be generated by identifierForVendor.",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "deviceType": {
      "description": "Device type - your description of the device the user is using. We use this for performance and conversion optimisation.",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "appName": {
      "description": "Your application name. Used for reporting.",
      "type": "string",
      "examples": [
        ""
      ]
    },
    "appVersion": {
      "description": "Your application version reference. Used for reporting and troubleshooting.",
      "type": "string",
      "examples": [
        "e.g. MyApp/v1.73"
      ]
    },
    "authenticationToken": {
      "description": "This is a hash signature for the request which authenticates it. Ask us for details of the mechanism for generating this token.",
      "type": "string",
      "examples": [
        ""
      ]
    }
  },
  "type": "object",
  "title": "RequestWithAuthenticationType",
  "x-readme-ref-name": "RequestWithAuthenticationType"
} as const;
export default RequestWithAuthenticationType
