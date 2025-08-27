import { Router } from "express";
import authRouter from "./auth";
import productRouter from "./products";
import userRouter from "./user";
import cartRoutes from "./cart";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/cart", cartRoutes);

export default rootRouter;
