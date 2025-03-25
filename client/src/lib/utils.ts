import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: number): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function serializeCanvasToImage(canvas: HTMLElement): Promise<string> {
  return new Promise((resolve) => {
    if (canvas) {
      import('html-to-image').then(({ toPng }) => {
        toPng(canvas, { quality: 0.95 })
          .then((dataUrl) => {
            resolve(dataUrl);
          })
          .catch((error) => {
            console.error('Error capturing slide:', error);
            resolve('');
          });
      });
    } else {
      resolve('');
    }
  });
}

export function fitTextToContainer(element: HTMLElement) {
  const maxWidth = element.offsetWidth;
  const maxHeight = element.offsetHeight;
  let fontSize = parseInt(window.getComputedStyle(element).fontSize);
  
  element.style.whiteSpace = 'nowrap';
  
  while (
    (element.scrollWidth > maxWidth || element.scrollHeight > maxHeight) && 
    fontSize > 8
  ) {
    fontSize--;
    element.style.fontSize = `${fontSize}px`;
  }
  
  if (element.scrollWidth <= maxWidth) {
    element.style.whiteSpace = 'normal';
  }
}

export function getContrastColor(hexColor: string): 'white' | 'black' {
  // Parse the hex color
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? 'black' : 'white';
}
