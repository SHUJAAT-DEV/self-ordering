import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  async findAll() {
    return { message: 'Categories service ready' };
  }
}