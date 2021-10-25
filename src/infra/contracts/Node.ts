export interface Node {
  type: string;
  name: string;
  text?: string;
  elements?: Node[];
  attributes?: {
    url?: string;
  };
}
