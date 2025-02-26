declare module 'uWebSockets.js' {
    export class App {
      post(route: string, handler: Function): this;
      listen(port: number, callback?: (listenSocket: any) => void): void;
    }
  
    export interface HttpResponse {
      writeStatus(status: string): this;
      writeHeader(name: string, value: string): this;
      end(body?: string): void;
      onData(callback: (chunk: ArrayBuffer, isLast: boolean) => void): void;
    }
  
    export interface HttpRequest {}
  }
  