import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/auth";

const authRouter: Router = Router();

authRouter.post("/login", errorHandler(login));
authRouter.post("/sign-up", errorHandler(signup));
authRouter.get("/me", [authMiddleware], errorHandler(me));

export default authRouter;
