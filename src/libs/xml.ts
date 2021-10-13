import * as parser from "xml-js";

import { Node } from "@application/contracts/Node";

export const toJS = (xml: string) => {
  return parser.xml2js(xml, {
    compact: false,
  });
};

export function getNodeFrom(name: string, from: Node[]): Node | null {
  const item = from.find((element) => element.name === name);

  if (item && item.elements && item.elements.length > 0) {
    const [element] = item.elements;
    return element;
  }

  if (name.includes("media") && item.attributes && item.attributes.url) {
    return {
      type: "element",
      name,
      text: item.attributes.url,
    };
  }

  return null;
}
