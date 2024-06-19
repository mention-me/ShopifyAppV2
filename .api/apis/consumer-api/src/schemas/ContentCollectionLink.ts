import Content from './Content.js';

const ContentCollectionLink = {
  "properties": {
    "relationship": {
      "title": "Relationship of the link between the two resources",
      "type": "string"
    },
    "resource": {
      "title": "The target resource being linked",
      "type": "array",
      "items": Content
    }
  },
  "type": "object",
  "title": "ContentCollectionLink",
  "x-readme-ref-name": "ContentCollectionLink"
} as const;
export default ContentCollectionLink
