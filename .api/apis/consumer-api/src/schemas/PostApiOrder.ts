const PostApiOrder = {
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
      }
    ]
  }
} as const;
export default PostApiOrder
