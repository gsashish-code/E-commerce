import { Router } from "express";
import authRouter from "./auth";
import productRouter from "./products";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productRouter);

export default rootRouter;
