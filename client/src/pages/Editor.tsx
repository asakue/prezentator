import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/editor/Header";
import { Toolbar } from "@/components/editor/Toolbar";
import { Canvas } from "@/components/editor/Canvas";
import { Sidebar } from "@/components/editor/Sidebar";
import { SlidesThumbnails } from "@/components/editor/SlidesThumbnails";
import { TemplateLibrary } from "@/components/editor/TemplateLibrary";
import { PresentationMode } from "@/components/editor/PresentationMode";
import { Footer } from "@/components/shared/Footer";
import { usePresentationStore } from "@/hooks/usePresentationStore";
import { RenderableElement, EditorState } from "@/lib/types";
import { SlideElement } from "@shared/schema";
import { exportToPdf, exportToHtml, downloadHtmlPresentation } from "@/lib/pdfExport";
import { STORAGE_KEY } from "@/lib/constants";

export default function Editor() {
  const { id } = useParams<{ id?: string }>();
  const { toast } = useToast();
  
  // Create a presentation store
  const { 
    presentation, 
    dispatch, 
    canUndo, 
    canRedo, 
    undo, 
    redo 
  } = usePresentationStore(id);
  
  // Editor state
  const [editorState, setEditorState] = useState<EditorState>({
    isTemplateLibraryOpen: false,
    isPresentationMode: false,
    isAnimationsPanelOpen: false,
    selectedElementId: null,
    editingElementId: null,
    activeTool: 'select',
    scale: 1,
  });

  // Refs for PDF export
  const slideRefs = useRef<HTMLElement[]>([]);
  
  // If no presentation found, redirect to home page
  useEffect(() => {
    if (!presentation && id) {
      const savedPresentations = localStorage.getItem(STORAGE_KEY);
      if (savedPresentations) {
        const presentations = JSON.parse(savedPresentations);
        const found = presentations.find((p: any) => p.id === id);
        if (!found) {
          toast({
            title: "Presentation not found",
            description: "The presentation you're looking for doesn't exist.",
            variant: "destructive"
          });
        }
      }
    }
  }, [presentation, id, toast]);

  if (!presentation) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  // Get current slide
  const currentSlide = presentation.slides[presentation.currentSlideIndex] || presentation.slides[0];
  
  // Convert slide elements to renderable elements
  const renderableElements: RenderableElement[] = currentSlide.elements.map(element => ({
    ...element,
    slideId: currentSlide.id,
    isSelected: element.id === editorState.selectedElementId,
    isEditing: element.id === editorState.editingElementId
  }));

  // Find selected element
  const selectedElement = editorState.selectedElementId 
    ? currentSlide.elements.find(el => el.id === editorState.selectedElementId) || null 
    : null;

  // Handler for updating title
  const handleTitleChange = (title: string) => {
    dispatch({ type: 'UPDATE_TITLE', payload: { title } });
  };

  // Handler for starting presentation mode
  const startPresentation = () => {
    setEditorState(prev => ({ ...prev, isPresentationMode: true }));
  };

  // Handler for exporting to PDF
  const exportAsPdf = async () => {
    try {
      await exportToPdf(presentation, slideRefs.current);
      toast({
        title: "PDF Export Successful",
        description: "Your presentation has been exported as a PDF.",
        variant: "default"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your presentation to PDF.",
        variant: "destructive"
      });
    }
  };

  // Handler for exporting to HTML
  const exportAsHtml = async () => {
    try {
      const html = await exportToHtml(presentation, slideRefs.current);
      downloadHtmlPresentation(html, `${presentation.title}.html`);
      toast({
        title: "HTML Export Successful",
        description: "Your presentation has been exported as an HTML file.",
        variant: "default"
      });
    } catch (error) {
      console.error("HTML export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your presentation to HTML.",
        variant: "destructive"
      });
    }
  };

  // Element selection handler
  const handleElementSelect = (elementId: string) => {
    setEditorState(prev => ({
      ...prev,
      selectedElementId: elementId,
      editingElementId: null
    }));
  };

  // Element change handler
  const handleElementChange = (elementId: string, updates: Partial<SlideElement>) => {
    if (updates.isEditing !== undefined) {
      setEditorState(prev => ({
        ...prev,
        editingElementId: updates.isEditing ? elementId : null
      }));
    }
    
    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        slideId: currentSlide.id,
        elementId,
        element: updates
      }
    });
  };

  // Element dragging handler
  const handleElementDrag = (elementId: string, position: { x: number, y: number }) => {
    dispatch({
      type: 'UPDATE_ELEMENT_POSITION',
      payload: {
        slideId: currentSlide.id,
        elementId,
        position
      }
    });
  };

  // Element resizing handler
  const handleElementResize = (elementId: string, size: { width: number, height: number }) => {
    dispatch({
      type: 'UPDATE_ELEMENT_SIZE',
      payload: {
        slideId: currentSlide.id,
        elementId,
        size
      }
    });
  };

  // Add new slide
  const handleAddSlide = () => {
    dispatch({ type: 'ADD_SLIDE', payload: {} });
  };

  // Select slide
  const handleSelectSlide = (index: number) => {
    dispatch({ type: 'SET_CURRENT_SLIDE', payload: { index } });
  };

  // Duplicate slide
  const handleDuplicateSlide = (slideId: string) => {
    dispatch({ type: 'DUPLICATE_SLIDE', payload: { slideId } });
  };

  // Delete slide
  const handleDeleteSlide = (slideId: string) => {
    dispatch({ type: 'DELETE_SLIDE', payload: { slideId } });
  };

  // Change slide background
  const handleSlideBackgroundChange = (slideId: string, background: string) => {
    dispatch({ type: 'SET_BACKGROUND', payload: { slideId, background } });
  };

  // Change slide transition
  const handleSlideTransitionChange = (slideId: string, transition: string) => {
    dispatch({ type: 'SET_TRANSITION', payload: { slideId, transition } });
  };

  // Change slide notes
  const handleSlideNotesChange = (slideId: string, notes: string) => {
    dispatch({ type: 'UPDATE_SLIDE_NOTES', payload: { slideId, notes } });
  };

  // Add new element
  const handleAddElement = (element: SlideElement) => {
    dispatch({
      type: 'ADD_ELEMENT',
      payload: {
        slideId: currentSlide.id,
        element
      }
    });
    
    // Auto-select the newly added element
    setEditorState(prev => ({
      ...prev,
      selectedElementId: element.id
    }));
  };

  // Toggle element visibility
  const handleElementVisibilityToggle = (elementId: string) => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (element) {
      const newOpacity = element.style.opacity === 0 ? 1 : 0;
      
      dispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
          slideId: currentSlide.id,
          elementId,
          element: {
            style: {
              ...element.style,
              opacity: newOpacity
            }
          }
        }
      });
    }
  };

  // Delete element
  const handleElementDelete = (elementId: string) => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        slideId: currentSlide.id,
        elementId
      }
    });
    
    // Deselect if the deleted element was selected
    if (editorState.selectedElementId === elementId) {
      setEditorState(prev => ({
        ...prev,
        selectedElementId: null
      }));
    }
  };

  // Bring element forward (increase z-index)
  const handleBringForward = (elementId: string) => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (element) {
      dispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
          slideId: currentSlide.id,
          elementId,
          element: {
            style: {
              ...element.style,
              zIndex: element.style.zIndex + 1
            }
          }
        }
      });
    }
  };

  // Send element backward (decrease z-index)
  const handleSendBackward = (elementId: string) => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (element && element.style.zIndex > 1) {
      dispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
          slideId: currentSlide.id,
          elementId,
          element: {
            style: {
              ...element.style,
              zIndex: element.style.zIndex - 1
            }
          }
        }
      });
    }
  };

  // Toggle animation panel
  const handleToggleAnimationsPanel = () => {
    setEditorState(prev => ({
      ...prev,
      isAnimationsPanelOpen: !prev.isAnimationsPanelOpen
    }));
  };

  // Change animation settings
  const handleAnimationChange = (elementId: string, animationType: string, duration: number, delay: number) => {
    const element = currentSlide.elements.find(el => el.id === elementId);
    if (element) {
      dispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
          slideId: currentSlide.id,
          elementId,
          element: {
            animation: {
              type: animationType,
              duration,
              delay
            }
          }
        }
      });
    }
  };

  // Apply template
  const handleApplyTemplate = (slideTemplates: any[]) => {
    // Clear all existing slides and replace with template slides
    slideTemplates.forEach((slide, index) => {
      if (index === 0) {
        // Replace first slide
        dispatch({
          type: 'UPDATE_SLIDE',
          payload: {
            slideId: presentation.slides[0].id,
            slide: {
              background: slide.background,
              transition: slide.transition,
              elements: slide.elements
            }
          }
        });
      } else {
        // Add new slides
        dispatch({
          type: 'ADD_SLIDE',
          payload: {
            slide
          }
        });
      }
    });
    
    dispatch({ type: 'SET_CURRENT_SLIDE', payload: { index: 0 } });
    
    // Close template library
    setEditorState(prev => ({
      ...prev,
      isTemplateLibraryOpen: false
    }));
    
    toast({
      title: "Template Applied",
      description: "The selected template has been applied to your presentation.",
      variant: "default"
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header
        title={presentation.title}
        onTitleChange={handleTitleChange}
        onPresentationStart={startPresentation}
        onExportPdf={exportAsPdf}
        onExportHtml={exportAsHtml}
      />

      {/* Toolbar */}
      <Toolbar
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onTemplateLibraryOpen={() => setEditorState(prev => ({ ...prev, isTemplateLibraryOpen: true }))}
        onAddElement={handleAddElement}
        onToggleAnimationsPanel={handleToggleAnimationsPanel}
        currentSlideId={currentSlide.id}
        selectedElement={selectedElement}
        onSelectedElementUpdate={(updates) => {
          if (selectedElement) {
            handleElementChange(selectedElement.id, updates);
          }
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Layers) */}
        <Sidebar
          elements={currentSlide.elements}
          selectedElementId={editorState.selectedElementId}
          onElementSelect={handleElementSelect}
          onElementVisibilityToggle={handleElementVisibilityToggle}
          onElementDelete={handleElementDelete}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          showAnimationsPanel={editorState.isAnimationsPanelOpen}
          onAnimationChange={handleAnimationChange}
        />

        {/* Canvas (Main Editing Area) */}
        <Canvas
          background={currentSlide.background}
          elements={renderableElements}
          onElementSelect={handleElementSelect}
          onElementChange={handleElementChange}
          onElementDrag={handleElementDrag}
          onElementResize={handleElementResize}
          scale={editorState.scale}
        />

        {/* Right Sidebar (Slides) */}
        <SlidesThumbnails
          slides={presentation.slides}
          currentSlideIndex={presentation.currentSlideIndex}
          onAddSlide={handleAddSlide}
          onSelectSlide={handleSelectSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onSlideBackgroundChange={handleSlideBackgroundChange}
          onSlideTransitionChange={handleSlideTransitionChange}
          onSlideNotesChange={handleSlideNotesChange}
        />
      </div>

      {/* Template Library Modal */}
      {editorState.isTemplateLibraryOpen && (
        <TemplateLibrary
          onClose={() => setEditorState(prev => ({ ...prev, isTemplateLibraryOpen: false }))}
          onApplyTemplate={handleApplyTemplate}
        />
      )}

      {/* Presentation Mode */}
      {editorState.isPresentationMode && (
        <PresentationMode
          slides={presentation.slides}
          startIndex={presentation.currentSlideIndex}
          onClose={() => setEditorState(prev => ({ ...prev, isPresentationMode: false }))}
          onSlideRef={(index, ref) => {
            if (ref) {
              slideRefs.current[index] = ref;
            }
          }}
        />
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
}
