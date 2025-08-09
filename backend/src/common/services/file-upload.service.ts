import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

@Injectable()
export class FileUploadService {
  private readonly uploadPath: string;
  private readonly maxFileSize: number = 5 * 1024 * 1024; // 5MB
  private readonly allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  constructor(private configService: ConfigService) {
    this.uploadPath = path.join(process.cwd(), 'uploads');
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    // Create subdirectories for different types
    const subDirs = ['categories', 'subcategories', 'products', 'temp'];
    subDirs.forEach(dir => {
      const dirPath = path.join(this.uploadPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  getMulterConfig(subDir: string = 'temp'): multer.Options {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(this.uploadPath, subDir);
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (this.allowedImageTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
      limits: {
        fileSize: this.maxFileSize,
        files: 10, // Max 10 files per upload
      },
    };
  }

  async processUploadedFile(file: Express.Multer.File, subDir: string): Promise<UploadedFile> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    
    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `${baseUrl}/uploads/${subDir}/${file.filename}`,
    };
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async moveFile(sourcePath: string, targetDir: string, filename?: string): Promise<string> {
    const targetPath = path.join(this.uploadPath, targetDir);
    
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    const finalFilename = filename || path.basename(sourcePath);
    const finalPath = path.join(targetPath, finalFilename);

    fs.renameSync(sourcePath, finalPath);
    
    return finalPath;
  }

  getFileUrl(subDir: string, filename: string): string {
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    return `${baseUrl}/uploads/${subDir}/${filename}`;
  }

  // Generate optimized images for different screen sizes (for PWA)
  async generateOptimizedVersions(filePath: string): Promise<{ thumbnail: string; medium: string; large: string }> {
    // This would typically use a library like Sharp for image optimization
    // For now, returning the same file path - implement Sharp integration later
    const filename = path.basename(filePath);
    const dir = path.dirname(filePath);
    
    return {
      thumbnail: path.join(dir, `thumb-${filename}`),
      medium: path.join(dir, `med-${filename}`),
      large: filePath,
    };
  }
}