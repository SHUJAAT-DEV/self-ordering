import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyTransactionDto } from './create-company-transaction.dto';

export class UpdateCompanyTransactionDto extends PartialType(CreateCompanyTransactionDto) {}
