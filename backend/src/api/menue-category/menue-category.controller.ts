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
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { MenueCategoryService } from "./menue-category.service";
import {
  CreateMenueCategoryDto,
  DeleteMenueCategory,
  UpdateMenueCategoryDto,
} from "./dto/create-menue-category.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { API_URLS } from "@/utils/enums/urls";
import { Response, Express } from "express";
import * as path from "path";

@Controller("menue-category")
export class MenueCategoryController {
  constructor(private readonly menueCategoryService: MenueCategoryService) {}

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
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
        }
        cb(null, true);
      },
    })
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMenueDto: CreateMenueCategoryDto
  ) {
    if (file) {
      const imagePath = `/menue-category/image/${file.filename}`;
      createMenueDto.image = imagePath;
    }
    return this.menueCategoryService.create(createMenueDto);
  }

  @Get("image/:filename")
  async getGameImage(@Param("filename") filename: string, @Res() res: Response) {
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

  @Post("update-menu-category")
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
          return cb(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
        }
        cb(null, true);
      },
    })
  )
  async updateMenuCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMenueCategoryDto: UpdateMenueCategoryDto
  ) {
    if (file) {
      const imagePath = `/menue-category/image/${file.filename}`;
      updateMenueCategoryDto.image = imagePath;
    }
    return this.menueCategoryService.updateMenueCategory(updateMenueCategoryDto);
  }

  @Get()
  findAll() {
    return this.menueCategoryService.findAll();
  }

  @Post("delete-menue-category")
  updateTable(@Body() args: DeleteMenueCategory) {
    // console.log("get here: ", createMenueDto);
    return this.menueCategoryService.deleteMenuCategory(args);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.menueCategoryService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateMenueCategoryDto: UpdateMenueCategoryDto
  ) {
    return this.menueCategoryService.update(+id, updateMenueCategoryDto);
  }

  // @Post(":id")
  // deleteMenuCategory(@Param("id") id: string) {
  //   return this.menueCategoryService.remove(+id);
  // }
}
