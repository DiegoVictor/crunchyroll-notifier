import * as parser from "xml-js";

import { Node } from "@infra/contracts/Node";
import { FieldsMap } from "@infra/contracts/FieldsMap";

export const toJS = (xml: string) => {
  return parser.xml2js(xml, {
    compact: false,
  });
};

export function getNode(name: string, from: Node[]): Node | null {
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

export function mapFields<T>(item: Node, fieldsMap: FieldsMap): T {
  return Object.keys(fieldsMap).reduce((map, property) => {
    const field = fieldsMap[property];
    const { tagName, parser } = field;

    const node = getNode(tagName, item.elements);
    if (node && node.text) {
      const text = node.text.trim().replace(/\s{2,}/gi, " ");
      const value = parser ? parser(text) : text;
      if (value) {
        map[property] = value;
      }
    }

    return map;
  }, {} as T);
}
