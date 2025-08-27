import { Router } from "express";
import authMiddleware from "../middleware/auth";
import { errorHandler } from "../error-handler";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  listOrders,
} from "../controllers/order";

const orderRoute: Router = Router();

orderRoute.post("/", [authMiddleware], errorHandler(createOrder));
orderRoute.get("/", [authMiddleware], errorHandler(listOrders));
orderRoute.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));
orderRoute.get("/:id", [authMiddleware], errorHandler(getOrderById));

export default orderRoute;
