import * as parser from "xml-js";

type Parser = (value: string) => string | string[] | Date;

interface FieldsMap {
  [key: string]: { tagName: string; parser?: Parser };
}

interface Node {
  type: string;
  name: string;
  text?: string;
  elements?: Node[];
  attributes?: {
    url?: string;
  };
}

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
      const value = parser ? parser(node.text) : node.text;
      if (value) {
        map[property] = value;
      }
    }

    return map;
  }, {} as T);
}
