const GetApiReferrerDashboard = {
  "metadata": {
    "allOf": [
      {
        "type": "object",
        "properties": {
          "version": {
            "type": "string",
            "pattern": "v2|v1",
            "enum": [
              "v2",
              "v1"
            ],
            "examples": [
              "v2"
            ],
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Version"
          }
        },
        "required": [
          "version"
        ]
      },
      {
        "type": "object",
        "properties": {
          "emailAddress": {
            "type": "string",
            "examples": [
              "jane.doe@example.com"
            ],
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Email address of the referrer whose dashboard you require"
          },
          "request[authenticationToken]": {
            "type": "string",
            "examples": [
              "[AUTHENTICATION-TOKEN]"
            ],
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "This is a generated token using a salted hash of the email address of the customer with a secret key. Please ask us for your secret key."
          },
          "request[partnerCode]": {
            "type": "string",
            "examples": [
              "[YOUR-PARTNER-CODE]"
            ],
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Your partner code, used to link to your users and offers"
          },
          "request[situation]": {
            "type": "string",
            "examples": [
              "mobile-app"
            ],
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Situation - a string representing where in the application you are making this request"
          },
          "request[ipAddress]": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "IP address of the customer connection. If you're making a request on behalf of a customer, pass their IP address here. If the customer will connect directly, leave this empty and we will retrieve this from their request."
          },
          "request[localeCode]": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Locale code - ISO standard locale code (e.g. en_GB) for the locale you expect the content to be in"
          },
          "segment": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Customer segment - a string containing segment data about this customer, e.g. vip or employee. You can concatenate multiple segments together if you wish using hyphens."
          },
          "uniqueCustomerIdentifier": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Customer Id - your unique identifier for this customer"
          },
          "request[userDeviceIdentifier]": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "User Device Identifier should be a unique reference to this combination of app + user."
          },
          "request[deviceType]": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Device type - your description of the device the user is using. We use this for performance and conversion optimisation."
          },
          "request[appName]": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Your application name. Used for reporting."
          },
          "request[appVersion]": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Your application version reference. Used for reporting and troubleshooting."
          }
        },
        "required": [
          "emailAddress",
          "request[authenticationToken]",
          "request[partnerCode]",
          "request[situation]"
        ]
      }
    ]
  }
} as const;
export default GetApiReferrerDashboard
