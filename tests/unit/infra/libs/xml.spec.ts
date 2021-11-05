import * as faker from "faker";

import { getNode, mapFields, toJS } from "@infra/libs/xml";

describe("XML", () => {
  it("should be able to parse XML to JS Object", async () => {
    const xmlParsed = toJS(`<items><item><title>Test</title></item></items>`);

    expect(xmlParsed).toStrictEqual({
      elements: [
        {
          elements: [
            {
              elements: [
                {
                  elements: [
                    {
                      text: "Test",
                      type: "text",
                    },
                  ],
                  name: "title",
                  type: "element",
                },
              ],
              name: "item",
              type: "element",
            },
          ],
          name: "items",
          type: "element",
        },
      ],
    });
  });

  it("should be able to get XML Node", async () => {
    const xmlParsed = toJS(`<items><item><title>Test</title></item></items>`);

    expect(getNode("items", xmlParsed.elements)).toStrictEqual({
      elements: [
        {
          elements: [
            {
              text: "Test",
              type: "text",
            },
          ],
          name: "title",
          type: "element",
        },
      ],
      name: "item",
      type: "element",
    });
  });

  it("should be able to get XML Media Node", async () => {
    const url = faker.internet.url();
    const name = "media:items";

    const xmlParsed = toJS(`<${name} url="${url}" />`);

    expect(getNode(name, xmlParsed.elements)).toStrictEqual({
      type: "element",
      name,
      text: url,
    });
  });

  it("should not be able to fin XML Node", async () => {
    const xmlParsed = toJS(`<items><item><title>Test</title></item></items>`);

    expect(getNode("channel", xmlParsed.elements)).toBe(null);
  });

  it("should be able to map XML Node fields", async () => {
    const title = faker.name.title();
    const subtitle = faker.name.title();
    const {
      elements: [element],
    } = toJS(
      `<item><title>${title}</title><subtitle>${subtitle}</subtitle></item>`
    );

    const fieldsMap = {
      title: {
        tagName: "title",
        parser: (value: string) => value.split(" ").slice(0, 1).pop(),
      },
      subtitle: {
        tagName: "subtitle",
      },
    };

    expect(mapFields(element, fieldsMap)).toStrictEqual({
      title: title.split(" ").slice(0, 1).pop(),
      subtitle,
    });
  });
});
