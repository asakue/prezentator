import { Presentation, Slide, SlideElement } from "@shared/schema";

// Actions that can be performed on a presentation
export type PresentationAction = 
  | { type: 'CREATE_PRESENTATION', payload: { title: string } }
  | { type: 'LOAD_PRESENTATION', payload: { presentation: Presentation } }
  | { type: 'UPDATE_TITLE', payload: { title: string } }
  | { type: 'ADD_SLIDE', payload: { slide?: Slide } }
  | { type: 'DELETE_SLIDE', payload: { slideId: string } }
  | { type: 'UPDATE_SLIDE', payload: { slideId: string, slide: Partial<Slide> } }
  | { type: 'DUPLICATE_SLIDE', payload: { slideId: string } }
  | { type: 'REORDER_SLIDES', payload: { sourceIndex: number, destinationIndex: number } }
  | { type: 'SET_CURRENT_SLIDE', payload: { index: number } }
  | { type: 'ADD_ELEMENT', payload: { slideId: string, element: SlideElement } }
  | { type: 'UPDATE_ELEMENT', payload: { slideId: string, elementId: string, element: Partial<SlideElement> } }
  | { type: 'DELETE_ELEMENT', payload: { slideId: string, elementId: string } }
  | { type: 'SET_BACKGROUND', payload: { slideId: string, background: string } }
  | { type: 'SET_TRANSITION', payload: { slideId: string, transition: string } }
  | { type: 'UPDATE_ELEMENT_POSITION', payload: { slideId: string, elementId: string, position: { x: number, y: number } } }
  | { type: 'UPDATE_ELEMENT_SIZE', payload: { slideId: string, elementId: string, size: { width: number, height: number } } }
  | { type: 'UPDATE_SLIDE_NOTES', payload: { slideId: string, notes: string } }
  | { type: 'CLEAR_HISTORY' };

// Interface for the presentation store state
export interface PresentationStore {
  presentation: Presentation | null;
  history: {
    past: Presentation[];
    future: Presentation[];
  };
  dispatch: (action: PresentationAction) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

// Interface for elements that can be rendered on a slide
export interface RenderableElement extends SlideElement {
  slideId: string;
  isSelected: boolean;
  isEditing: boolean;
}

// Interface for editor state
export interface EditorState {
  isTemplateLibraryOpen: boolean;
  isPresentationMode: boolean;
  isAnimationsPanelOpen: boolean;
  selectedElementId: string | null;
  editingElementId: string | null;
  activeTool: 'select' | 'text' | 'image' | 'shape';
  scale: number;
}
