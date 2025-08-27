import { Router } from "express";
import authRouter from "./auth";
import productRouter from "./products";
import userRouter from "./user";
import cartRoutes from "./cart";
import orderRoute from "./order";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/cart", cartRoutes);
rootRouter.use("/orders", orderRoute);

export default rootRouter;
