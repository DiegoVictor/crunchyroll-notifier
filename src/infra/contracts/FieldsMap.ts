export interface FieldsMap {
  [key: string]: {
    tagName: string;
    parser?: (value: string) => string | string[] | Date | number;
  };
}
