import { NextFunction, Request, Response } from "express";
import { UnAuthorized } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "ADMIN") next();
  else {
    next(
      new UnAuthorized(
        "user should be admin to perform this action",
        ErrorCode.USER_IS_NOT_ADMIN
      )
    );
  }
};

export default adminMiddleware;
