import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(new Error('Hanya file gambar yang diperbolehkan'), false);
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
};

@Injectable()
export class UploadService {
  getFileUrl(req: any, filename: string): string {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
  }
}