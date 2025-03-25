import { Template, Slide } from "@shared/schema";
import { generateId } from "./utils";

// Helper function to create a text element
const createTextElement = (content: string, x: number, y: number, width: number, height: number, zIndex: number, options: any = {}) => {
  return {
    id: generateId(),
    type: 'text' as const,
    content,
    style: {
      position: { x, y },
      size: { width, height },
      zIndex,
      ...options
    }
  };
};

// Helper function to create an image element
const createImageElement = (url: string, x: number, y: number, width: number, height: number, zIndex: number, options: any = {}) => {
  return {
    id: generateId(),
    type: 'image' as const,
    content: url,
    style: {
      position: { x, y },
      size: { width, height },
      zIndex,
      ...options
    }
  };
};

// Helper function to create a shape element
const createShapeElement = (shapeType: string, x: number, y: number, width: number, height: number, zIndex: number, options: any = {}) => {
  return {
    id: generateId(),
    type: 'shape' as const,
    content: shapeType,
    style: {
      position: { x, y },
      size: { width, height },
      zIndex,
      ...options
    }
  };
};

// Template: Modern Gradient
const modernGradientSlides: Slide[] = [
  {
    id: generateId(),
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    transition: 'fade',
    elements: [
      createTextElement(
        'Welcome to Your Presentation',
        400, 250, 600, 100, 10,
        { 
          color: '#ffffff', 
          fontFamily: 'Poppins', 
          fontSize: '48px', 
          fontWeight: '700',
          textAlign: 'center' 
        }
      ),
      createTextElement(
        'Create beautiful presentations with PresentCraft',
        400, 370, 600, 50, 9,
        { 
          color: 'rgba(255,255,255,0.9)', 
          fontFamily: 'Inter', 
          fontSize: '24px',
          textAlign: 'center' 
        }
      ),
      createShapeElement(
        'rectangle',
        450, 450, 300, 70, 8,
        { 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          borderRadius: '35px',
          color: '#ffffff',
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: '600'
        }
      )
    ]
  },
  {
    id: generateId(),
    background: '#ffffff',
    transition: 'slide',
    elements: [
      createTextElement(
        'About Our Company',
        150, 100, 500, 80, 10,
        { 
          color: '#3b82f6', 
          fontFamily: 'Poppins', 
          fontSize: '40px', 
          fontWeight: '700'
        }
      ),
      createTextElement(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.',
        150, 200, 500, 150, 9,
        { 
          color: '#4b5563', 
          fontFamily: 'Inter', 
          fontSize: '18px'
        }
      ),
      createImageElement(
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600',
        700, 150, 400, 300, 8, 
        { borderRadius: '8px' }
      )
    ]
  }
];

// Template: Dark Elegance
const darkEleganceSlides: Slide[] = [
  {
    id: generateId(),
    background: '#111827',
    transition: 'fade',
    elements: [
      createTextElement(
        'Dark Elegance',
        400, 250, 600, 100, 10,
        { 
          color: '#ffffff', 
          fontFamily: 'Poppins', 
          fontSize: '52px', 
          fontWeight: '700',
          textAlign: 'center' 
        }
      ),
      createTextElement(
        'A sophisticated presentation template',
        400, 370, 600, 50, 9,
        { 
          color: 'rgba(255,255,255,0.7)', 
          fontFamily: 'Inter', 
          fontSize: '24px',
          textAlign: 'center' 
        }
      ),
      createShapeElement(
        'line',
        500, 450, 200, 4, 8,
        { 
          backgroundColor: '#8b5cf6'
        }
      )
    ]
  },
  {
    id: generateId(),
    background: '#1f2937',
    transition: 'slide',
    elements: [
      createTextElement(
        'Our Services',
        150, 100, 500, 80, 10,
        { 
          color: '#ffffff', 
          fontFamily: 'Poppins', 
          fontSize: '40px', 
          fontWeight: '600'
        }
      ),
      createShapeElement(
        'rectangle',
        150, 200, 250, 200, 9,
        { 
          backgroundColor: 'rgba(139, 92, 246, 0.1)', 
          borderRadius: '8px'
        }
      ),
      createShapeElement(
        'rectangle',
        450, 200, 250, 200, 9,
        { 
          backgroundColor: 'rgba(59, 130, 246, 0.1)', 
          borderRadius: '8px'
        }
      ),
      createShapeElement(
        'rectangle',
        750, 200, 250, 200, 9,
        { 
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '8px'
        }
      ),
      createTextElement(
        'Service 1',
        150, 230, 250, 50, 10,
        { 
          color: '#ffffff', 
          fontFamily: 'Inter', 
          fontSize: '22px',
          fontWeight: '600',
          textAlign: 'center'
        }
      ),
      createTextElement(
        'Service 2',
        450, 230, 250, 50, 10,
        { 
          color: '#ffffff', 
          fontFamily: 'Inter', 
          fontSize: '22px',
          fontWeight: '600',
          textAlign: 'center'
        }
      ),
      createTextElement(
        'Service 3',
        750, 230, 250, 50, 10,
        { 
          color: '#ffffff', 
          fontFamily: 'Inter', 
          fontSize: '22px',
          fontWeight: '600',
          textAlign: 'center'
        }
      )
    ]
  }
];

// Template: Minimalist
const minimalistSlides: Slide[] = [
  {
    id: generateId(),
    background: '#ffffff',
    transition: 'none',
    elements: [
      createTextElement(
        'Minimalist Design',
        400, 250, 600, 100, 10,
        { 
          color: '#111827', 
          fontFamily: 'Inter', 
          fontSize: '48px', 
          fontWeight: '700',
          textAlign: 'center' 
        }
      ),
      createTextElement(
        'Clean and simple presentation template',
        400, 370, 600, 50, 9,
        { 
          color: '#4b5563', 
          fontFamily: 'Inter', 
          fontSize: '20px',
          textAlign: 'center' 
        }
      ),
      createShapeElement(
        'rectangle',
        400, 100, 400, 2, 8,
        { 
          backgroundColor: '#111827'
        }
      ),
      createShapeElement(
        'rectangle',
        400, 450, 400, 2, 8,
        { 
          backgroundColor: '#111827'
        }
      )
    ]
  },
  {
    id: generateId(),
    background: '#ffffff',
    transition: 'none',
    elements: [
      createTextElement(
        'Portfolio',
        150, 100, 300, 80, 10,
        { 
          color: '#111827', 
          fontFamily: 'Inter', 
          fontSize: '36px', 
          fontWeight: '700'
        }
      ),
      createShapeElement(
        'rectangle',
        150, 190, 50, 2, 9,
        { 
          backgroundColor: '#111827'
        }
      ),
      createImageElement(
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600',
        150, 220, 300, 200, 8, 
        { borderRadius: '0px' }
      ),
      createImageElement(
        'https://images.unsplash.com/photo-1620912189866-894181705ea2?w=600',
        480, 220, 300, 200, 8, 
        { borderRadius: '0px' }
      ),
      createImageElement(
        'https://images.unsplash.com/photo-1600132806370-bf17e6e2dce1?w=600',
        810, 220, 300, 200, 8, 
        { borderRadius: '0px' }
      )
    ]
  }
];

// Template: Academic
const academicSlides: Slide[] = [
  {
    id: generateId(),
    background: '#FFFBEB',
    transition: 'fade',
    elements: [
      createTextElement(
        'Research Presentation',
        400, 200, 600, 100, 10,
        { 
          color: '#1e3a8a', 
          fontFamily: 'Poppins', 
          fontSize: '44px', 
          fontWeight: '700',
          textAlign: 'center' 
        }
      ),
      createTextElement(
        'By John Doe, PhD',
        400, 300, 600, 50, 9,
        { 
          color: '#4b5563', 
          fontFamily: 'Inter', 
          fontSize: '22px',
          textAlign: 'center' 
        }
      ),
      createTextElement(
        'Department of Computer Science',
        400, 350, 600, 50, 9,
        { 
          color: '#4b5563', 
          fontFamily: 'Inter', 
          fontSize: '18px',
          textAlign: 'center' 
        }
      ),
      createShapeElement(
        'rectangle',
        400, 100, 600, 10, 8,
        { 
          backgroundColor: '#f59e0b',
          borderRadius: '5px'
        }
      )
    ]
  },
  {
    id: generateId(),
    background: '#ffffff',
    transition: 'slide',
    elements: [
      createTextElement(
        'Research Objectives',
        150, 100, 900, 80, 10,
        { 
          color: '#1e3a8a', 
          fontFamily: 'Poppins', 
          fontSize: '36px', 
          fontWeight: '600'
        }
      ),
      createShapeElement(
        'rectangle',
        150, 190, 5, 250, 9,
        { 
          backgroundColor: '#f59e0b'
        }
      ),
      createTextElement(
        '• To investigate the relationship between X and Y\n• To develop a new framework for understanding Z\n• To evaluate the effectiveness of existing methods\n• To propose improvements to the current model',
        180, 200, 800, 200, 9,
        { 
          color: '#4b5563', 
          fontFamily: 'Inter', 
          fontSize: '20px'
        }
      )
    ]
  }
];

// Template: Data Focused
const dataFocusedSlides: Slide[] = [
  {
    id: generateId(),
    background: '#ECFDF5',
    transition: 'fade',
    elements: [
      createTextElement(
        'Data Analysis Report',
        400, 200, 600, 100, 10,
        { 
          color: '#065f46', 
          fontFamily: 'Poppins', 
          fontSize: '44px', 
          fontWeight: '700',
          textAlign: 'center' 
        }
      ),
      createTextElement(
        'Q3 2023 Performance',
        400, 300, 600, 50, 9,
        { 
          color: '#4b5563', 
          fontFamily: 'Inter', 
          fontSize: '24px',
          textAlign: 'center' 
        }
      ),
      createShapeElement(
        'rectangle',
        300, 400, 600, 100, 8,
        { 
          backgroundColor: '#10b981',
          borderRadius: '8px',
          opacity: 0.2
        }
      ),
      createTextElement(
        'Prepared by Business Analytics Team',
        400, 425, 600, 50, 9,
        { 
          color: '#065f46', 
          fontFamily: 'Inter', 
          fontSize: '18px',
          textAlign: 'center',
          fontWeight: '500'
        }
      )
    ]
  },
  {
    id: generateId(),
    background: '#ffffff',
    transition: 'fade',
    elements: [
      createTextElement(
        'Key Performance Indicators',
        150, 100, 900, 80, 10,
        { 
          color: '#065f46', 
          fontFamily: 'Poppins', 
          fontSize: '36px', 
          fontWeight: '600'
        }
      ),
      createShapeElement(
        'rectangle',
        150, 200, 280, 200, 9,
        { 
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '8px'
        }
      ),
      createShapeElement(
        'rectangle',
        460, 200, 280, 200, 9,
        { 
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '8px'
        }
      ),
      createShapeElement(
        'rectangle',
        770, 200, 280, 200, 9,
        { 
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '8px'
        }
      ),
      createTextElement(
        'Revenue\n$8.2M',
        290, 250, 280, 100, 10,
        { 
          color: '#065f46', 
          fontFamily: 'Inter', 
          fontSize: '24px',
          fontWeight: '600',
          textAlign: 'center'
        }
      ),
      createTextElement(
        'Growth\n+12.3%',
        600, 250, 280, 100, 10,
        { 
          color: '#065f46', 
          fontFamily: 'Inter', 
          fontSize: '24px',
          fontWeight: '600',
          textAlign: 'center'
        }
      ),
      createTextElement(
        'Customers\n12,458',
        910, 250, 280, 100, 10,
        { 
          color: '#065f46', 
          fontFamily: 'Inter', 
          fontSize: '24px',
          fontWeight: '600',
          textAlign: 'center'
        }
      )
    ]
  }
];

// Template: Creative Vibes
const creativeVibesSlides: Slide[] = [
  {
    id: generateId(),
    background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    transition: 'zoom',
    elements: [
      createTextElement(
        'Creative Portfolio',
        400, 250, 600, 100, 10,
        { 
          color: '#ffffff', 
          fontFamily: 'Poppins', 
          fontSize: '52px', 
          fontWeight: '700',
          textAlign: 'center' 
        }
      ),
      createTextElement(
        'Showcase your work with style',
        400, 350, 600, 50, 9,
        { 
          color: 'rgba(255,255,255,0.9)', 
          fontFamily: 'Inter', 
          fontSize: '24px',
          textAlign: 'center' 
        }
      ),
      createShapeElement(
        'circle',
        200, 200, 150, 150, 8,
        { 
          backgroundColor: 'rgba(255,255,255,0.2)'
        }
      ),
      createShapeElement(
        'circle',
        800, 300, 100, 100, 8,
        { 
          backgroundColor: 'rgba(255,255,255,0.15)'
        }
      )
    ]
  },
  {
    id: generateId(),
    background: '#ffffff',
    transition: 'slide',
    elements: [
      createTextElement(
        'My Work',
        150, 100, 500, 80, 10,
        { 
          color: '#ec4899', 
          fontFamily: 'Poppins', 
          fontSize: '40px', 
          fontWeight: '700'
        }
      ),
      createImageElement(
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
        150, 200, 350, 250, 8, 
        { borderRadius: '16px' }
      ),
      createImageElement(
        'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=600',
        550, 200, 500, 250, 8, 
        { borderRadius: '16px' }
      ),
      createTextElement(
        'Design is not just what it looks like and feels like. Design is how it works.',
        400, 500, 600, 100, 9,
        { 
          color: '#4b5563', 
          fontFamily: 'Inter', 
          fontSize: '18px',
          fontStyle: 'italic',
          textAlign: 'center'
        }
      )
    ]
  }
];

// Export all templates
export const templates: Template[] = [
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    category: 'business',
    thumbnail: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    description: 'Professional and clean design',
    slides: modernGradientSlides
  },
  {
    id: 'dark-elegance',
    name: 'Dark Elegance',
    category: 'business',
    thumbnail: '#111827',
    description: 'Sophisticated dark theme',
    slides: darkEleganceSlides
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'minimal',
    thumbnail: '#ffffff',
    description: 'Clean and simple design',
    slides: minimalistSlides
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'education',
    thumbnail: '#FFFBEB',
    description: 'Perfect for educational content',
    slides: academicSlides
  },
  {
    id: 'data-focused',
    name: 'Data Focused',
    category: 'business',
    thumbnail: '#ECFDF5',
    description: 'Great for data presentation',
    slides: dataFocusedSlides
  },
  {
    id: 'creative-vibes',
    name: 'Creative Vibes',
    category: 'creative',
    thumbnail: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    description: 'Bold and artistic design',
    slides: creativeVibesSlides
  }
];

// Helper function to create an empty presentation with default slide
export const createEmptyPresentation = (title: string = 'Untitled Presentation') => {
  const slideId = generateId();
  return {
    id: generateId(),
    title,
    slides: [
      {
        id: slideId,
        background: '#ffffff',
        transition: 'none',
        elements: [
          createTextElement(
            'Click to edit title',
            400, 250, 600, 100, 10,
            { 
              color: '#111827', 
              fontFamily: 'Poppins', 
              fontSize: '44px', 
              fontWeight: '600',
              textAlign: 'center' 
            }
          ),
          createTextElement(
            'Click to edit subtitle',
            400, 350, 600, 50, 9,
            { 
              color: '#4b5563', 
              fontFamily: 'Inter', 
              fontSize: '24px',
              textAlign: 'center' 
            }
          )
        ]
      }
    ],
    created: Date.now(),
    updated: Date.now(),
    currentSlideIndex: 0
  };
};
