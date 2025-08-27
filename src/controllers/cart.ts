import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { CartItem, Product } from "../generated/prisma";
import { prismaClient } from "..";
import { data } from "react-router-dom";
import { includes } from "zod";

export const addItemToCart = async (request: Request, response: Response) => {
  const validatedData = CreateCartSchema.parse(request.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  const cart = await prismaClient.cartItem.create({
    data: {
      userId: Number(request.user.id),
      productId: Number(product.id),
      quantity: validatedData.quantity,
    },
  });
  response.json({ data: cart });
};
export const deleteItemFromCart = async (
  request: Request,
  response: Response
) => {
  let cartItem: CartItem;
  try {
    cartItem = await prismaClient.cartItem.findFirstOrThrow({
      where: {
        id: Number(request.params.id),
      },
    });
  } catch (error) {
    throw new NotFoundException(
      "Cart item not Found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  if (cartItem.userId !== request.user.id) {
    throw new NotFoundException(
      "Cart item not Found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  await prismaClient.cartItem.delete({
    where: {
      id: Number(request.params.id),
    },
  });
  response.json({
    message: "Cart item removed successfully!",
    data: { id: Number(request.params.id) },
  });
};

export const changeQuantity = async (request: Request, response: Response) => {
  const validatedData = ChangeQuantitySchema.parse(request.body);
  let cartItem: CartItem;
  try {
    cartItem = await prismaClient.cartItem.findFirstOrThrow({
      where: {
        id: Number(request.params.id),
      },
    });
  } catch (error) {
    throw new NotFoundException(
      "Cart item not Found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  if (cartItem.userId !== request.user.id) {
    throw new NotFoundException(
      "Cart item not Found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: Number(request.params.id),
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  response.json({
    message: "Cart Quantity updated Successfully",
    data: updatedCart,
  });
};

export const getCart = async (request: Request, response: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: request.user.id,
    },
    include: {
      product: true,
    },
  });
  response.json({
    data: cart,
  });
};
