import { HTTPException } from "./root";

export class UnProcessableEntity extends HTTPException {
  constructor(error: any, message: string, errorCode: any) {
    super(message, errorCode, 422, error);
  }
}
