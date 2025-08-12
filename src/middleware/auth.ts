import { NextFunction, Request, Response } from "express";
import { UnAuthorized } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. extract token from headers
  const token = req.headers.authorization!;

  // 2. token is not present, throw unauthorized error
  if (!token)
    next(
      new UnAuthorized("user is not authorized!", ErrorCode.USER_NOT_AUTHORIZED)
    );
  try {
    // 3. token is present validate and extract payload

    const payload: { userId: number } = jwt.verify(token, JWT_SECRET) as any;
    // 4.to get user from payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    //  5.to attach user to current request object
    if (!user) {
      return next(
        new UnAuthorized(
          "user is not authorized!",
          ErrorCode.USER_NOT_AUTHORIZED
        )
      );
    }
    req.user = user;
    next();
  } catch (error) {
    next(
      new UnAuthorized("user is not authorized!", ErrorCode.USER_NOT_AUTHORIZED)
    );
  }
};

export default authMiddleware;
