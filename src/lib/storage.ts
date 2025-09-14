import { supabase } from './supabase';

export class StorageService {
  // Upload file to specific bucket
  static async uploadFile(
    bucket: 'avatars' | 'posts' | 'stories' | 'clips' | 'files',
    file: File,
    userId: string,
    fileName?: string
  ) {
    try {
      const fileExt = file.name.split('.').pop();
      const finalFileName = fileName || `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${finalFileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { path: data.path, publicUrl, error: null };
    } catch (error) {
      console.error('Upload error:', error);
      return { path: null, publicUrl: null, error: error as Error };
    }
  }

  // Delete file from storage
  static async deleteFile(bucket: string, filePath: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete error:', error);
      return { error: error as Error };
    }
  }

  // Get signed URL for private files
  static async getSignedUrl(bucket: string, filePath: string, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;
      return { signedUrl: data.signedUrl, error: null };
    } catch (error) {
      console.error('Signed URL error:', error);
      return { signedUrl: null, error: error as Error };
    }
  }

  // Upload avatar
  static async uploadAvatar(file: File, userId: string) {
    return this.uploadFile('avatars', file, userId, 'avatar');
  }

  // Upload post media
  static async uploadPostMedia(file: File, userId: string) {
    return this.uploadFile('posts', file, userId);
  }

  // Upload story media
  static async uploadStoryMedia(file: File, userId: string) {
    return this.uploadFile('stories', file, userId);
  }

  // Upload clip video
  static async uploadClipVideo(file: File, userId: string) {
    return this.uploadFile('clips', file, userId);
  }

  // Upload general file
  static async uploadGeneralFile(file: File, userId: string) {
    return this.uploadFile('files', file, userId);
  }
}