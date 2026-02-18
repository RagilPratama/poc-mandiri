import ImageKit from 'imagekit';
import { config } from '../config/env';

export const imagekit = new ImageKit({
  publicKey: config.imagekit.publicKey,
  privateKey: config.imagekit.privateKey,
  urlEndpoint: config.imagekit.urlEndpoint,
});

export async function uploadImage(
  file: Buffer | string,
  fileName: string,
  folder: string
): Promise<{ url: string; fileId: string }> {
  try {
    const result = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error('Gagal upload foto');
  }
}

export async function deleteImage(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('Error deleting from ImageKit:', error);
    throw new Error('Gagal hapus foto');
  }
}
