import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/auth";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateUser,
} from "../controllers/user";
import adminMiddleware from "../middleware/admin";

const userRouter: Router = Router();

userRouter.post("/address", [authMiddleware], errorHandler(addAddress));

userRouter.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);
userRouter.get("/address", [authMiddleware], errorHandler(getAddresses));
userRouter.get("/", [authMiddleware], errorHandler(updateUser));

export default userRouter;
