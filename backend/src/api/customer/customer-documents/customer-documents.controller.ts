import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
} from "@nestjs/common";
import { diskStorage } from "multer";
import { CustomerDocumentsService } from "./customer-documents.service";
import { CreateCustomerDocumentDto } from "./dto/create-customer-document.dto";
import { UpdateCustomerDocumentDto } from "./dto/update-customer-document.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

@Controller("customer-documents")
export class CustomerDocumentsController {
  constructor(
    private readonly customerDocumentsService: CustomerDocumentsService
  ) {}

  @Post("upload")
  @UseInterceptors(
    FilesInterceptor("files", 5, {
      storage: diskStorage({
        //destination: "./uploads/customer-images",
        destination: "/opt/customer",
        filename: (req, file, cb) => {
          const name = file.originalname.split(".")[0];
          const fileExtension = file.originalname.split(".")[1];
          const newFileName =
            name.split(" ").join("_") + "_" + Date.now() + "." + fileExtension;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(
            /\.(jpg|jpeg|png|gif|webp|doc|docx|xls|xlsx|pdf)$/
          )
        ) {
          return cb(null, false);
        }
        cb(null, true);
      },
    })
  )
  createWithImg(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files) {
      return null;
    } else {
      const imagePaths = files.map((file) => {
        const baseUrl = process.env.BASE_URL;

        const imagePath = `${baseUrl}/customer-documents/images/${file.filename}`;
        return imagePath;
      });
      return imagePaths;
    }
  }

  @Get("images/:filename")
  async getGameImage(@Param("filename") filename, @Res() res: Response) {
    // res.sendFile(filename, { root: "./uploads/customer-images" });
    res.sendFile(filename, { root: "/opt/customer" });
  }

  // @Post()
  // create(@Body() createCustomerDocumentDto: CreateCustomerDocumentDto) {
  //   return this.customerDocumentsService.create(createCustomerDocumentDto);
  // }

  @Get("customer-images/:customerId")
  getCustomerImages(@Param("customerId") customerId: string) {
    return this.customerDocumentsService.getCustomerImages(customerId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customerDocumentsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCustomerDocumentDto: UpdateCustomerDocumentDto
  ) {
    return this.customerDocumentsService.update(+id, updateCustomerDocumentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customerDocumentsService.remove(+id);
  }
}
