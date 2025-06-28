import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { MenueService } from "./menue.service";
import {
  CreateMenueDto,
  DeleteMenue,
  UpdateMenueDto,
} from "./dto/create-menue.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { API_URLS } from "@/utils/enums/urls";
import { Express, Response } from "express";
import * as path from "path";

@Controller("menue")
export class MenueController {
  constructor(private readonly menueService: MenueService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || "uploads/menu-images",
        filename: (req, file, cb) => {
          const name = path.parse(file.originalname).name.replace(/\s+/g, "_");
          const fileExtension = path.extname(file.originalname);
          const newFileName = `${name}_${Date.now()}${fileExtension}`;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gsif)$/)) {
          return cb(
            new HttpException("Invalid file type", HttpStatus.BAD_REQUEST),
            false
          );
        }
        cb(null, true);
      },
    })
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMenueDto: CreateMenueDto
  ) {
    if (file) {
      const imagePath = `/menue/image/${file.filename}`;
      createMenueDto.image = imagePath;
    }
    return this.menueService.create(createMenueDto);
  }

  @Get("image/:filename")
  async getMenuImage(
    @Param("filename") filename: string,
    @Res() res: Response
  ) {
    const options = {
      root: process.env.UPLOAD_DIR || "uploads/menu-images",
    };
    res.sendFile(filename, options, (err) => {
      if (err) {
        res.status(HttpStatus.NOT_FOUND).send({
          statusCode: HttpStatus.NOT_FOUND,
          message: "File not found",
        });
      }
    });
  }

  @Post("update-menu")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || "uploads/menu-images",
        filename: (req, file, cb) => {
          const name = path.parse(file.originalname).name.replace(/\s+/g, "_");
          const fileExtension = path.extname(file.originalname);
          const newFileName = `${name}_${Date.now()}${fileExtension}`;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new HttpException("Invalid file type", HttpStatus.BAD_REQUEST),
            false
          );
        }
        cb(null, true);
      },
    })
  )
  async updateMenu(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMenueDto: UpdateMenueDto
  ) {
    if (file) {
      const imagePath = `/menue/image/${file.filename}`;
      updateMenueDto.image = imagePath;
    }
    return this.menueService.updateMenue(updateMenueDto);
  }

  @Get()
  findAll() {
    return this.menueService.findAll();
  }

  @Post("delete-menue")
  updateTable(@Body() args: DeleteMenue) {
    // console.log("get here: ", createMenueDto);
    return this.menueService.deleteMenue(args);
  }

  @Get("category/:categoryId")
  getByCategory(@Param("categoryId") categoryId: string) {
    return this.menueService.getByCategoryId(categoryId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.menueService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.menueService.remove(+id);
  }
}
