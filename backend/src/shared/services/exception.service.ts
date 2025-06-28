import { HttpException, Injectable } from '@nestjs/common'
import {
  NotAcceptableException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  UnprocessableEntityException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
// import { EXCEPTION_TYPES } from '../../utils/enums/exception.types.enum'
// import { CUSTOM_EXCEPTION_ERROR } from '../../../utils/interfaces/exception.interface'

@Injectable()
export class ExceptionService {
  sendNotAcceptableException(message: string): never {
    throw new NotAcceptableException(message)
  }

  sendNotFoundException(message: string): never {
    throw new NotFoundException(message)
  }

  sendInternalServerErrorException(message: string): never {
    throw new InternalServerErrorException(message)
  }

  sendConflictException(message: string): never {
    throw new ConflictException(message)
  }

  sendUnprocessableEntityException(message: string): never {
    throw new UnprocessableEntityException(message)
  }

  sendBadRequestException(message: string): never {
    throw new BadRequestException(message)
  }

  sendForbiddenException(message: string): never {
    throw new ForbiddenException(message)
  }

  sendUnauthorizedException(message: string): never {
    throw new UnauthorizedException(message)
  }
  // sendWebClientExceptions(
  //   exceptionType: EXCEPTION_TYPES,
  //   property: string,
  //   constraintKey: string,
  //   message: string
  // ): never {
  //   const error: CUSTOM_EXCEPTION_ERROR = {
  //     property,
  //     messages: {
  //       [constraintKey]: message,
  //     },
  //   }
  //   switch (exceptionType) {
  //     case EXCEPTION_TYPES.BAD_REQUEST:
  //       throw new BadRequestException([error])
  //       break
  //     case EXCEPTION_TYPES.FOBIDDEN:
  //       throw new ForbiddenException([error])
  //       break
  //     case EXCEPTION_TYPES.CONFLICT:
  //       throw new ConflictException([error])
  //       break
  //     default:
  //       throw new Error(message)
  //   }
  // }
}
