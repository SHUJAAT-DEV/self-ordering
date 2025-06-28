import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderMenueDto } from './create-order-menue.dto';

export class UpdateOrderMenueDto extends PartialType(CreateOrderMenueDto) {}
