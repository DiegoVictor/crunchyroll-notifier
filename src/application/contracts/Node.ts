export interface Attributes {
  url?: string;
}

export interface Node {
  type: string;
  name: string;
  text?: string;
  elements?: Node[];
  attributes?: Attributes;
}
