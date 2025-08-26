import { NextFunction, Request, Response } from "express";
import { ErrorCode, HTTPException } from "./exceptions/root";
import { InternalException } from "./exceptions/internalException";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HTTPException;
      console.log("🚀 ~ errorHandler ~ error:", error);
      if (error instanceof HTTPException) {
        exception = error;
      } else if (error.name === "ZodError") {
        exception = new InternalException(
          "Validation error",
          error,
          ErrorCode.UNPROCESSABLE_ENTITY
        );
      } else {
        exception = new InternalException(
          "Something went wrong!",
          error,
          ErrorCode.INTERNAL_SERVER_ERROR
        );
      }
      next(exception);
    }
  };
};
