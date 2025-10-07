declare module "qrcode-reader" {
  type Callback = (err: Error | null, value: { result: string }) => void;

  export default class QrCode {
    constructor();
    callback: Callback;
    decode(image: { data: any; width: number; height: number }): void;
  }
}
