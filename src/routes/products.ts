import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/admin";

const productRouter: Router = Router();

productRouter.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);
productRouter.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(getProducts)
);
productRouter.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProduct)
);

productRouter.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
productRouter.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);
export default productRouter;
