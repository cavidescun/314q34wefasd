import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions: MulterOptions = {

  storage: memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    if (file.mimetype === 'application/pdf') {
      callback(null, true);
    } else {
      callback(
        new HttpException(
          `Tipo de archivo no soportado: ${extname(file.originalname)}. Solo se permiten archivos PDF.`,
          HttpStatus.BAD_REQUEST
        ),
        false
      );
    }
  },
};

export const multerConfig = {
  dest: './uploads',
};