import * as parser from "xml-js";

export const toJS = (xml: string) => {
  return parser.xml2js(xml, {
    compact: false,
  });
};
