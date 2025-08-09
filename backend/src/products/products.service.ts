import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  async findAll() {
    return { message: 'Products service ready' };
  }
}