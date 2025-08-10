import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  /**
   * Upload file to storage service (Firebase Storage, AWS S3, etc.)
   * For now, this returns the base64 data URL as a placeholder
   * In production, you would implement actual file upload logic
   */
  uploadFile(file: File, folder: string = 'profile-pictures'): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        // In production, you would upload to cloud storage here
        // and return the public URL
        const result = reader.result as string;
        observer.next(result);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select an image file' };
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return { valid: false, error: 'Allowed file types: JPG, JPEG, PNG, GIF, WebP' };
    }

    return { valid: true };
  }

  /**
   * Generate a unique filename
   */
  generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    return `${timestamp}_${randomString}${extension}`;
  }

  /**
   * Compress image before upload (optional)
   */
  compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}
