import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import bcrypt, { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";
import { UnProcessableEntity } from "../exceptions/validations";
import { LoginSchema, SignUpSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not-found";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignUpSchema.parse(req.body);
  const { email, password, name } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user)
    new BadRequestsException(
      "User already exist!",
      ErrorCode.USER_ALREADY_EXIST
    );
  user = await prismaClient.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      name,
    },
  });
  res.json({ user });
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  LoginSchema.parse(req.body);
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException(
      "User does not exist!",
      ErrorCode.USER_NOT_FOUND
    );
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      "password entered is incorrect",
      ErrorCode.INCORRECT_PASSWORD
    );
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({ user, token });
};

export const me = async (req: Request, res: Response) => {
  res.json({ user: req.user });
};
