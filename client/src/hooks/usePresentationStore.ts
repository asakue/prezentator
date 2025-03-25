import { useState, useReducer, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PresentationAction, PresentationStore } from '@/lib/types';
import { Presentation, Slide, SlideElement } from '@shared/schema';
import { generateId } from '@/lib/utils';
import { STORAGE_KEY } from '@/lib/constants';
import { createEmptyPresentation } from '@/lib/templates';

// The maximum number of undo steps to store
const MAX_HISTORY_LENGTH = 50;

// Reducer for presentation actions
function presentationReducer(state: Presentation, action: PresentationAction): Presentation {
  let updatedSlides: Slide[];
  let updatedPresentation: Presentation;
  
  switch (action.type) {
    case 'UPDATE_TITLE':
      return {
        ...state,
        title: action.payload.title,
        updated: Date.now()
      };
      
    case 'ADD_SLIDE':
      const newSlide = action.payload.slide || {
        id: generateId(),
        elements: [],
        background: '#ffffff',
        transition: 'none'
      };
      
      return {
        ...state,
        slides: [...state.slides, newSlide],
        currentSlideIndex: state.slides.length,
        updated: Date.now()
      };
      
    case 'DELETE_SLIDE':
      // Prevent deleting the last slide
      if (state.slides.length <= 1) {
        return state;
      }
      
      updatedSlides = state.slides.filter(slide => slide.id !== action.payload.slideId);
      
      return {
        ...state,
        slides: updatedSlides,
        currentSlideIndex: Math.min(state.currentSlideIndex, updatedSlides.length - 1),
        updated: Date.now()
      };
      
    case 'UPDATE_SLIDE':
      updatedSlides = state.slides.map(slide => 
        slide.id === action.payload.slideId 
          ? { ...slide, ...action.payload.slide }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'DUPLICATE_SLIDE':
      const slideIndex = state.slides.findIndex(slide => slide.id === action.payload.slideId);
      
      if (slideIndex === -1) {
        return state;
      }
      
      const slideToDuplicate = state.slides[slideIndex];
      const duplicatedSlide: Slide = {
        ...JSON.parse(JSON.stringify(slideToDuplicate)),
        id: generateId(),
        elements: slideToDuplicate.elements.map(element => ({
          ...element,
          id: generateId()
        }))
      };
      
      updatedSlides = [
        ...state.slides.slice(0, slideIndex + 1),
        duplicatedSlide,
        ...state.slides.slice(slideIndex + 1)
      ];
      
      return {
        ...state,
        slides: updatedSlides,
        currentSlideIndex: slideIndex + 1,
        updated: Date.now()
      };
      
    case 'REORDER_SLIDES':
      const { sourceIndex, destinationIndex } = action.payload;
      const reorderedSlides = [...state.slides];
      const [removed] = reorderedSlides.splice(sourceIndex, 1);
      reorderedSlides.splice(destinationIndex, 0, removed);
      
      return {
        ...state,
        slides: reorderedSlides,
        currentSlideIndex: state.currentSlideIndex === sourceIndex 
          ? destinationIndex 
          : state.currentSlideIndex,
        updated: Date.now()
      };
      
    case 'SET_CURRENT_SLIDE':
      return {
        ...state,
        currentSlideIndex: action.payload.index
      };
      
    case 'ADD_ELEMENT':
      updatedSlides = state.slides.map(slide =>
        slide.id === action.payload.slideId
          ? {
              ...slide,
              elements: [...slide.elements, action.payload.element]
            }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'UPDATE_ELEMENT':
      updatedSlides = state.slides.map(slide =>
        slide.id === action.payload.slideId
          ? {
              ...slide,
              elements: slide.elements.map(element =>
                element.id === action.payload.elementId
                  ? { ...element, ...action.payload.element }
                  : element
              )
            }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'DELETE_ELEMENT':
      updatedSlides = state.slides.map(slide =>
        slide.id === action.payload.slideId
          ? {
              ...slide,
              elements: slide.elements.filter(
                element => element.id !== action.payload.elementId
              )
            }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'SET_BACKGROUND':
      updatedSlides = state.slides.map(slide =>
        slide.id === action.payload.slideId
          ? { ...slide, background: action.payload.background }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'SET_TRANSITION':
      updatedSlides = state.slides.map(slide =>
        slide.id === action.payload.slideId
          ? { ...slide, transition: action.payload.transition }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'UPDATE_ELEMENT_POSITION':
      updatedSlides = state.slides.map(slide =>
        slide.id === action.payload.slideId
          ? {
              ...slide,
              elements: slide.elements.map(element =>
                element.id === action.payload.elementId
                  ? {
                      ...element,
                      style: {
                        ...element.style,
                        position: action.payload.position
                      }
                    }
                  : element
              )
            }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'UPDATE_ELEMENT_SIZE':
      updatedSlides = state.slides.map(slide =>
        slide.id === action.payload.slideId
          ? {
              ...slide,
              elements: slide.elements.map(element =>
                element.id === action.payload.elementId
                  ? {
                      ...element,
                      style: {
                        ...element.style,
                        size: action.payload.size
                      }
                    }
                  : element
              )
            }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'UPDATE_SLIDE_NOTES':
      updatedSlides = state.slides.map(slide =>
        slide.id === action.payload.slideId
          ? { ...slide, notes: action.payload.notes }
          : slide
      );
      
      return {
        ...state,
        slides: updatedSlides,
        updated: Date.now()
      };
      
    case 'CREATE_PRESENTATION':
      return createEmptyPresentation(action.payload.title);
      
    case 'LOAD_PRESENTATION':
      return action.payload.presentation;
      
    default:
      return state;
  }
}

// Hook that creates and manages presentation state
export const usePresentationStore = (initialPresentationId?: string): PresentationStore => {
  // Load presentations from localStorage
  const [savedPresentations, setSavedPresentations] = useLocalStorage<Presentation[]>(STORAGE_KEY, []);
  
  // Find the requested presentation or create a new one
  const getInitialPresentation = useCallback(() => {
    if (initialPresentationId && savedPresentations.length > 0) {
      const found = savedPresentations.find(p => p.id === initialPresentationId);
      if (found) return found;
    }
    return createEmptyPresentation();
  }, [initialPresentationId, savedPresentations]);
  
  // Initialize state
  const [presentation, dispatch] = useReducer(presentationReducer, null, getInitialPresentation);
  
  // History for undo/redo
  const [history, setHistory] = useState<{
    past: Presentation[];
    future: Presentation[];
  }>({
    past: [],
    future: []
  });
  
  // Save presentation to localStorage whenever it changes
  useEffect(() => {
    if (!presentation) return;
    
    const presentationExists = savedPresentations.some(p => p.id === presentation.id);
    
    if (presentationExists) {
      setSavedPresentations(
        savedPresentations.map(p =>
          p.id === presentation.id ? presentation : p
        )
      );
    } else {
      setSavedPresentations([...savedPresentations, presentation]);
    }
    
    // Update history (for undo/redo)
    setHistory(prev => ({
      past: [
        ...prev.past.slice(-MAX_HISTORY_LENGTH + 1),
        JSON.parse(JSON.stringify(presentation))
      ],
      future: []
    }));
  }, [presentation]);
  
  // Custom actions
  const wrappedDispatch = useCallback((action: PresentationAction) => {
    if (action.type === 'CLEAR_HISTORY') {
      setHistory({ past: [], future: [] });
      return;
    }
    
    dispatch(action);
  }, []);
  
  // Undo functionality
  const undo = useCallback(() => {
    if (history.past.length === 0) return;
    
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    
    setHistory({
      past: newPast,
      future: [JSON.parse(JSON.stringify(presentation)), ...history.future]
    });
    
    dispatch({ type: 'LOAD_PRESENTATION', payload: { presentation: previous } });
  }, [history, presentation]);
  
  // Redo functionality
  const redo = useCallback(() => {
    if (history.future.length === 0) return;
    
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    
    setHistory({
      past: [...history.past, JSON.parse(JSON.stringify(presentation))],
      future: newFuture
    });
    
    dispatch({ type: 'LOAD_PRESENTATION', payload: { presentation: next } });
  }, [history, presentation]);
  
  return {
    presentation,
    history,
    dispatch: wrappedDispatch,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undo,
    redo
  };
};
