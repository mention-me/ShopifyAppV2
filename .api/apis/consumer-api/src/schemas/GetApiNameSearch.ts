const GetApiNameSearch = {
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
          "name": {
            "type": "string",
            "examples": [
              "[REFERRERS-NAME]"
            ],
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Name of a referrer to search for (entered by the new customer)"
          },
          "email": {
            "type": "string",
            "$schema": "http://json-schema.org/draft-04/schema#",
            "description": "Optionally ask the new customer to qualify the name with an email address belonging to the referrer. We typically ask for a Name first and then if no matches found, offer Name + Email address."
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
          "name",
          "request[partnerCode]",
          "request[situation]"
        ]
      }
    ]
  }
} as const;
export default GetApiNameSearch
