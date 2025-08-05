import { HTTPException } from "./root";

export class InternalException extends HTTPException {
  constructor(error: any, message: string, errorCode: number) {
    super(message, errorCode, 500, error);
  }
}
