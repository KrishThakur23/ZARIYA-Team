/**
 * Browser-based image processing utilities as fallback when AI enhancement is unavailable
 */

export function enhanceImageWithCanvas(originalDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply basic enhancements
        ctx.drawImage(img, 0, 0);
        
        // Get image data for pixel manipulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple brightness and contrast enhancement
        for (let i = 0; i < data.length; i += 4) {
          // Brightness adjustment (+10%)
          data[i] = Math.min(255, data[i] * 1.1);     // Red
          data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
          data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
          
          // Contrast adjustment
          data[i] = Math.max(0, Math.min(255, (data[i] - 128) * 1.1 + 128));
          data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * 1.1 + 128));
          data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * 1.1 + 128));
        }

        // Put enhanced image data back
        ctx.putImageData(imageData, 0, 0);

        // Convert to data URL
        const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(enhancedDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = originalDataUrl;
  });
}

export function createCartoonEffect(originalDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple cartoon effect: reduce colors and increase contrast
        for (let i = 0; i < data.length; i += 4) {
          // Reduce color palette (quantization)
          data[i] = Math.round(data[i] / 32) * 32;       // Red
          data[i + 1] = Math.round(data[i + 1] / 32) * 32; // Green
          data[i + 2] = Math.round(data[i + 2] / 32) * 32; // Blue
          
          // Increase contrast
          data[i] = Math.max(0, Math.min(255, (data[i] - 128) * 1.5 + 128));
          data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * 1.5 + 128));
          data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * 1.5 + 128));
        }

        ctx.putImageData(imageData, 0, 0);
        const cartoonDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(cartoonDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = originalDataUrl;
  });
}
