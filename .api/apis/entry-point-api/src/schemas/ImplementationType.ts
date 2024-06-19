const ImplementationType = {
  "properties": {
    "wrapContentWithBranding": {
      "description": "If true (default), serve content in the URLs with customisable branding wrapper (normally a logo and padding). If false, serve content without any wrapping. ",
      "type": "boolean",
      "examples": [
        true
      ]
    },
    "showCloseIcon": {
      "description": "If true, show close icon in the pages (so they can be included in an iframe). You need to listen for postMessages to close and fulfill the flow if you do open this flow in an iframe. ",
      "type": "boolean",
      "examples": [
        false
      ]
    }
  },
  "type": "object",
  "title": "ImplementationType",
  "x-readme-ref-name": "ImplementationType"
} as const;
export default ImplementationType
