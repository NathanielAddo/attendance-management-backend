export type CustomError = { message: string; statusCode: number };

export const toCustomError = (error: unknown): CustomError => {
  if (typeof error === "object" && error !== null && "message" in error && "statusCode" in error) {
    return error as CustomError;
  }
  return { message: "Internal Server Error", statusCode: 500 };
};