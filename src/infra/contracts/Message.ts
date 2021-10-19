export interface Message<T> {
  Id: string;
  ReceiptHandle: string;
  MessageBody: T;
}
