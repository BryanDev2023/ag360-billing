import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryResponse } from './types/cloudinary-response';
import streamifier from 'streamifier';
import config from '../config/environment';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
    })
  }

  uploadToCloudinaryBuffer(body: { buffer: any }): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        (error: CloudinaryResponse, result: CloudinaryResponse) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );
      streamifier.createReadStream(body.buffer).pipe(stream);
    });
  }

  async uploadImage(file: MulterFile, folder: string = 'brands'): Promise<string> {
    if (!file) {
      throw new BadRequestException({
        status: 400,
        message: "No file provided",
        error: "Bad request"
      });
    }

    try {
      // Convertir el archivo a base64
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      // Subir a Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder,
        resource_type: 'auto',
      });

      return result.secure_url;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Error uploading file: ${error.message}`,
        error: "Bad request"
      });
    }
  }

  async deleteImage(url: string): Promise<void> {
    if (!url) return;

    try {
      // Extraer el public_id de la URL
      const publicId = url.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
}
