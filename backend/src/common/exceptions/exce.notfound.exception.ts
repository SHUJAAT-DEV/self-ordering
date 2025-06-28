import { HttpException, HttpStatus } from "@nestjs/common";

export class GameNotFoundException extends HttpException {

  constructor(erroMessage: string) {
    super({ erroMessage }, HttpStatus.NOT_FOUND)
  }

}