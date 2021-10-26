export interface Message {
  Id: string;
  ReceiptHandle: string;
  MessageBody: {
    [key: string]: string;
  };
}
