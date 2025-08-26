import { BEPaginationParams, FEPaginationInput } from "./types/common-util";

export const getPagination = ({
  limit,
  page,
}: FEPaginationInput): BEPaginationParams => {
  return {
    take: limit,
    skip: Number(limit) * (Number(page) - 1),
  };
};
