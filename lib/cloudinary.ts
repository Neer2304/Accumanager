// lib/cloudinary.ts
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

// Define upload options type
export interface UploadOptions extends UploadApiOptions {
  folder?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: Record<string, unknown>;
  [key: string]: unknown;
}

// Define URL options type
export interface UrlOptions {
  fetch_format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif';
  quality?: 'auto' | number;
  width?: number;
  height?: number;
  crop?: 'scale' | 'fit' | 'fill' | 'limit' | 'pad' | 'thumb';
  [key: string]: unknown;
}

export async function uploadImage(
  file: string | Buffer, 
  folder: string = 'products',
  options: UploadOptions = {}
): Promise<UploadedImage> {
  try {
    const result = await cloudinary.uploader.upload(file.toString(), {
      folder,
      resource_type: 'auto',
      ...options
    }) as UploadApiResponse;

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function uploadMultipleImages(
  files: (string | Buffer)[],
  folder: string = 'products'
): Promise<UploadedImage[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

export async function deleteMultipleImages(publicIds: string[]): Promise<boolean[]> {
  const deletePromises = publicIds.map(publicId => deleteImage(publicId));
  return Promise.all(deletePromises);
}

export function getOptimizedUrl(publicId: string, options: UrlOptions = {}): string {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options
  });
}