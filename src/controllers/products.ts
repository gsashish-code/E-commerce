import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { productSchema } from "../schema/product";
import { NotFoundException } from "../exceptions/not-found";
import { getPagination } from "../common-utils";

export const createProduct = async (request: Request, response: Response) => {
  const parsedBody = productSchema.parse(request.body);

  const product = await prismaClient.product.create({
    data: parsedBody,
  });

  return response.json({ data: product });
};

export const updateProduct = async (request: Request, response: Response) => {
  try {
    const product = request.body;
    const parseProduct = productSchema.parse(product);
    const updateProduct = await prismaClient.product.update({
      where: {
        id: Number(request.params.id),
      },
      data: {
        ...parseProduct,
      },
    });
    response.json({ data: updateProduct });
  } catch (error) {
    throw new NotFoundException("Products not found", ErrorCode.USER_NOT_FOUND);
  }
};
export const deleteProduct = async (request: Request, response: Response) => {
  try {
    if (request.params.id) {
      const updateProduct = await prismaClient.product.delete({
        where: {
          id: Number(request.params.id),
        },
      });
      response.json({ data: updateProduct });
    } else {
      throw new NotFoundException(
        "Products not found",
        ErrorCode.USER_NOT_FOUND
      );
    }
  } catch (error) {
    throw new NotFoundException("Products not found", ErrorCode.USER_NOT_FOUND);
  }
};
export const getProducts = async (request: Request, response: Response) => {
  const count = await prismaClient.product.count();
  let products = [];
  const { limit = null, page = null } = request.query;
  if (limit || page) {
    const { skip, take } = getPagination({
      limit: +(limit ?? 0),
      page: +(page ?? 1),
    });
    console.log("limit ", { take, skip });
    products = await prismaClient.product.findMany({
      skip: +skip,
      take: +take,
    });
    response.json({
      limit: +(limit ?? 0),
      page: +(page ?? 1),
      total: count,
      list: products,
    });
  } else {
    products = await prismaClient.product.findMany();
    response.json({
      data: products,
    });
  }
};

export const getProduct = async (request: Request, response: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: Number(request.params.id),
      },
    });
    response.json({ data: product });
  } catch (error) {
    throw new NotFoundException("Product not found", ErrorCode.USER_NOT_FOUND);
  }
};
