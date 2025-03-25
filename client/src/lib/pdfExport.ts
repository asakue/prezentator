import { Presentation, Slide } from "@shared/schema";
import { serializeCanvasToImage } from "./utils";

// Function to export presentation as PDF
export async function exportToPdf(presentation: Presentation, slideElements: HTMLElement[]): Promise<void> {
  try {
    // Use jsPDF and html-to-image
    const { default: jsPDF } = await import('jspdf');
    
    // Create PDF document with the right dimensions (16:9 aspect ratio)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
    });
    
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    
    // Capture each slide as an image and add to PDF
    for (let i = 0; i < slideElements.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const slide = slideElements[i];
      const dataUrl = await serializeCanvasToImage(slide);
      
      if (dataUrl) {
        // Add the image to the PDF
        pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
        
        // If the slide has notes, add them at the bottom
        const slideData = presentation.slides[i];
        if (slideData.notes) {
          const fontSize = 8;
          pdf.setFontSize(fontSize);
          pdf.setTextColor(100, 100, 100);
          
          // Add a separator line
          pdf.setDrawColor(200, 200, 200);
          pdf.line(10, height - 20, width - 10, height - 20);
          
          // Add the notes text
          pdf.text('Notes: ' + slideData.notes, 10, height - 15, {
            maxWidth: width - 20
          });
        }
      }
    }
    
    // Save the PDF
    pdf.save(`${presentation.title}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

// Function to export presentation as HTML (for embedding)
export async function exportToHtml(presentation: Presentation, slideElements: HTMLElement[]): Promise<string> {
  try {
    const slideImages = [];
    
    // Capture each slide as an image
    for (const slide of slideElements) {
      const dataUrl = await serializeCanvasToImage(slide);
      if (dataUrl) {
        slideImages.push(dataUrl);
      }
    }
    
    // Create HTML template with embedded slides and navigation controls
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${presentation.title}</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Inter', sans-serif;
            background-color: #000;
            overflow: hidden;
          }
          .presentation-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .slide {
            width: 100%;
            max-width: 90%;
            max-height: 90%;
            display: none;
            object-fit: contain;
          }
          .slide.active {
            display: block;
          }
          .controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
          }
          .control-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }
          .slide-counter {
            position: absolute;
            bottom: 20px;
            right: 20px;
            color: white;
            background: rgba(0,0,0,0.5);
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="presentation-container">
          ${slideImages.map((src, i) => `<img src="${src}" alt="Slide ${i+1}" class="slide ${i === 0 ? 'active' : ''}" data-slide="${i}">`).join('')}
          
          <div class="controls">
            <button class="control-btn prev-btn" onclick="prevSlide()">←</button>
            <button class="control-btn next-btn" onclick="nextSlide()">→</button>
          </div>
          
          <div class="slide-counter">
            <span id="current-slide">1</span> / <span id="total-slides">${slideImages.length}</span>
          </div>
        </div>
        
        <script>
          const slides = document.querySelectorAll('.slide');
          const currentSlideElem = document.getElementById('current-slide');
          let currentSlide = 0;
          
          function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            currentSlideElem.textContent = index + 1;
          }
          
          function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
          }
          
          function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
          }
          
          // Keyboard navigation
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
              nextSlide();
            } else if (e.key === 'ArrowLeft') {
              prevSlide();
            }
          });
        </script>
      </body>
      </html>
    `;
    
    return html;
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw new Error('Failed to generate HTML presentation');
  }
}

// Function to download the HTML presentation
export function downloadHtmlPresentation(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
