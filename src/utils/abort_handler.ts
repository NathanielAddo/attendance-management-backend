// //abort_handler.ts

// import { HttpResponse } from "uWebSockets.js";

// /**
//  * Attaches an abort handler to track aborted requests.
//  * @param res - HttpResponse object
//  * @returns A function to check if the request has been aborted
//  */
// export const attachAbortHandler = (res: HttpResponse): (() => boolean) => {
//   let aborted = false;

//   res.onAborted(() => {
//     aborted = true;
//     console.log("Response aborted by the client.");
//   });

//   // Return a function to check the aborted state
//   return () => aborted;
// };