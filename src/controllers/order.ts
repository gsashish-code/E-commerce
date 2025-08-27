import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (request: Request, response: Response) => {
  // 1.to Create a transaction
  // 2. to list all cart items and proceed if cart is not empty
  //  3. calculate total amount
  //  4. fetch address of user
  // 5. to define computed fields for formatted address on address module
  // 6. we will create a order and order product
  // 7. create a event
  // 8. to empty cart
  return await prismaClient.$transaction(async (transaction) => {
    const cartItems = await transaction.cartItem.findMany({
      where: {
        userId: request.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length === 0) {
      return response.json({ message: "Cart is empty!" });
    }
    const totalPrice = cartItems.reduce((acc, curr) => {
      acc += curr.quantity * +curr.product.price;
      return acc;
    }, 0);
    const address = await transaction.address.findFirst({
      where: {
        id: Number(request.user.defaultShippingAddress),
      },
    });
    const order = await transaction.order.create({
      data: {
        userId: request.user.id,
        netAmount: totalPrice,
        address: address?.formattedAddress ?? "",
        orderProduct: {
          create: cartItems.map((cart) => {
            return { productId: cart.productId, quantity: cart.quantity };
          }),
        },
      },
    });
    const orderEvent = await transaction.orderEvent.create({
      data: { orderId: order.id },
    });
    await transaction.cartItem.deleteMany({
      where: {
        userId: request.user.id,
      },
    });
    return response.json({
      data: {
        ...order,
      },
    });
  });
};

export const listOrders = async (request: Request, response: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: request.user.id,
    },
  });
  response.json({ data: orders });
};

export const cancelOrder = async (request: Request, response: Response) => {
  try {
    return prismaClient.$transaction(async (transaction) => {
      const checkOrder = await transaction.order.findFirst({
        where: {
          id: Number(request.params.id),
        },
      });
      if (checkOrder?.userId !== request.user.id) {
        return response.json({
          message: "You can't Cancel Someone elses order",
        });
      }
      const order = await transaction.order.update({
        where: {
          id: Number(request.params.id),
        },
        data: {
          status: "CANCELED",
        },
      });
      await transaction.orderEvent.create({
        data: { orderId: order.id, status: "CANCELED" },
      });
      response.json({ data: order });
    });
  } catch (error) {
    throw new NotFoundException("Order not Found!", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const getOrderById = async (request: Request, response: Response) => {
  try {
    const orders = await prismaClient.order.findMany({
      where: {
        userId: request.user.id,
        id: Number(request.params.id),
      },
      include: {
        orderProduct: true,
        orderEvent: true,
      },
    });
    response.json({ data: orders });
  } catch (error) {
    throw new NotFoundException("Order not Found!", ErrorCode.ORDER_NOT_FOUND);
  }
};
