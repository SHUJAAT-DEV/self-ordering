import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDocumentDto } from './create-customer-document.dto';

export class UpdateCustomerDocumentDto extends PartialType(CreateCustomerDocumentDto) {}
