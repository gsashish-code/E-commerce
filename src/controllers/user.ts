import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Address, User } from "../generated/prisma";
import { prismaClient } from "..";
import { success } from "zod";

export const addAddress = async (request: Request, response: Response) => {
  const validAddress = AddressSchema.parse(request.body);
  try {
    const address = await prismaClient.address.create({
      data: {
        ...validAddress,
        userId: request.user.id,
      },
    });
    response.json({ data: address });
  } catch (error) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};
export const deleteAddress = async (request: Request, response: Response) => {
  try {
    if (!request.params?.id)
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_PRESENT
      );
    else {
      await prismaClient.address.delete({
        where: { id: +request.params.id },
      });
      response.json({ success: true, id: +request.params.id });
    }
  } catch (error) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_PRESENT
    );
  }
};

export const getAddresses = async (request: Request, response: Response) => {
  try {
    const addresses = await prismaClient.address.findMany({
      where: { userId: +request.user.id },
    });
    response.json({ data: addresses });
  } catch (error) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};

export const updateUser = async (request: Request, response: Response) => {
  const validatedUser = UpdateUserSchema.parse(request.body);
  let shippingAddress: Address;
  let billingAddress: Address;

  if (validatedUser.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: Number(validatedUser.defaultShippingAddress),
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Shipping Address Not Found",
        ErrorCode.ADDRESS_NOT_PRESENT
      );
    }
    // checking if the address belongs to the user createdBy user should be same
    if (shippingAddress.userId !== request.user.id) {
      throw new NotFoundException(
        "Shipping Address Not Found",
        ErrorCode.ADDRESS_NOT_PRESENT
      );
    }
  }

  if (validatedUser.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: Number(validatedUser.defaultBillingAddress),
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Billing Address Not Found",
        ErrorCode.ADDRESS_NOT_PRESENT
      );
    }
    // checking if the address belongs to the user createdBy user should be same
    if (billingAddress.userId !== request.user.id) {
      throw new NotFoundException(
        "Shipping Address Not Found",
        ErrorCode.ADDRESS_NOT_PRESENT
      );
    }
  }

  const updateData = Object.fromEntries(
    Object.entries(validatedUser).filter(([_, value]) => value !== undefined)
  );
  const updatedUser = await prismaClient.user.update({
    where: {
      id: Number(request.user.id),
    },
    data: updateData,
  });
  response.json({ data: updatedUser });
};
