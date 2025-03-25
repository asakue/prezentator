import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Defining the types for our presentation data model
// These will be stored in localStorage, no DB needed

export interface Slide {
  id: string;
  elements: SlideElement[];
  background: string;
  transition: string;
  notes?: string;
}

export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  style: {
    position: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
    rotation?: number;
    zIndex: number;
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: string;
    backgroundColor?: string;
    borderRadius?: string;
    opacity?: number;
  };
  animation?: {
    type: string;
    duration: number;
    delay: number;
  };
  isEditing?: boolean; // Добавлено для поддержки режима редактирования текста
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  created: number;
  updated: number;
  currentSlideIndex: number;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
  slides: Slide[];
}

// Simple schema for validating presentation data
export const presentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  slides: z.array(
    z.object({
      id: z.string(),
      elements: z.array(
        z.object({
          id: z.string(),
          type: z.enum(['text', 'image', 'shape']),
          content: z.string(),
          style: z.object({
            position: z.object({
              x: z.number(),
              y: z.number()
            }),
            size: z.object({
              width: z.number(),
              height: z.number()
            }),
            rotation: z.number().optional(),
            zIndex: z.number(),
            color: z.string().optional(),
            fontFamily: z.string().optional(),
            fontSize: z.string().optional(),
            fontWeight: z.string().optional(),
            textAlign: z.string().optional(),
            backgroundColor: z.string().optional(),
            borderRadius: z.string().optional(),
            opacity: z.number().optional()
          }),
          animation: z.object({
            type: z.string(),
            duration: z.number(),
            delay: z.number()
          }).optional(),
          isEditing: z.boolean().optional()
        })
      ),
      background: z.string(),
      transition: z.string(),
      notes: z.string().optional()
    })
  ),
  created: z.number(),
  updated: z.number(),
  currentSlideIndex: z.number()
});
