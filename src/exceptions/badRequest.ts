import { ErrorCode, HTTPException } from "./root";

export class BadRequestsException extends HTTPException {
  constructor(message: string, error: ErrorCode) {
    super(message, error, 404, null);
  }
}
