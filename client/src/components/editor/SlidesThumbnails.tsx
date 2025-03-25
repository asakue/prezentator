import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slide } from "@shared/schema";
import { SLIDE_BACKGROUNDS, TRANSITION_TYPES } from "@/lib/constants";
import { PlusIcon } from "lucide-react";

interface SlidesThumbnailsProps {
  slides: Slide[];
  currentSlideIndex: number;
  onAddSlide: () => void;
  onSelectSlide: (index: number) => void;
  onDuplicateSlide: (slideId: string) => void;
  onDeleteSlide: (slideId: string) => void;
  onSlideBackgroundChange: (slideId: string, background: string) => void;
  onSlideTransitionChange: (slideId: string, transition: string) => void;
  onSlideNotesChange: (slideId: string, notes: string) => void;
}

export function SlidesThumbnails({
  slides,
  currentSlideIndex,
  onAddSlide,
  onSelectSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onSlideBackgroundChange,
  onSlideTransitionChange,
  onSlideNotesChange
}: SlidesThumbnailsProps) {
  const currentSlide = slides[currentSlideIndex];
  const [showNotes, setShowNotes] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Preview function for each slide
  const renderSlidePreview = (slide: Slide, index: number) => {
    const isCurrentSlide = index === currentSlideIndex;
    const borderStyle = isCurrentSlide 
      ? "border-2 border-primary-500" 
      : "border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600";
    
    return (
      <div 
        key={slide.id}
        className={`${borderStyle} rounded overflow-hidden slide-thumbnail cursor-pointer mb-3`}
        onClick={() => onSelectSlide(index)}
      >
        <div className="bg-white w-full h-full p-2 flex items-center justify-center text-xs relative dark:bg-gray-700">
          <span className="absolute top-1 left-1 bg-gray-500 text-white rounded-sm px-1">{index + 1}</span>
          <div 
            className="w-full h-full flex items-center justify-center"
            style={slide.background.startsWith('#') || slide.background.startsWith('linear-gradient')
              ? { background: slide.background }
              : { backgroundColor: slide.background }}
          >
            {/* Simplified slide preview */}
            {slide.elements.length > 0 ? (
              <div className="w-full h-full relative">
                {slide.elements.map(element => {
                  const scaleRatio = 0.2; // Adjust based on your thumbnail size
                  const left = element.style.position.x * scaleRatio;
                  const top = element.style.position.y * scaleRatio;
                  const width = element.style.size.width * scaleRatio;
                  const height = element.style.size.height * scaleRatio;
                  
                  if (element.type === 'text') {
                    return (
                      <div 
                        key={element.id}
                        className="absolute bg-gray-300 dark:bg-gray-600"
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          zIndex: element.style.zIndex
                        }}
                      />
                    );
                  } else if (element.type === 'image') {
                    return (
                      <div 
                        key={element.id}
                        className="absolute bg-gray-400 dark:bg-gray-500"
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          zIndex: element.style.zIndex
                        }}
                      />
                    );
                  } else if (element.type === 'shape') {
                    return (
                      <div 
                        key={element.id}
                        className="absolute bg-primary-300 dark:bg-primary-700"
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          zIndex: element.style.zIndex,
                          borderRadius: element.style.borderRadius
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="text-gray-400 dark:text-gray-500 text-xs">Empty Slide</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-l border-gray-200 w-64 flex-none overflow-y-auto dark:bg-gray-800 dark:border-gray-700 hidden lg:block">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Slides</h3>
          <Button 
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-700"
            onClick={onAddSlide}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {slides.map((slide, index) => renderSlidePreview(slide, index))}
        </div>
        
        {/* Slide Settings */}
        {currentSlide && (
          <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 mb-3 dark:text-gray-200">Slide Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">Background</label>
                <div className="flex space-x-2">
                  {SLIDE_BACKGROUNDS.map((bg) => (
                    <button 
                      key={bg.value}
                      className={`w-6 h-6 rounded-full border ${currentSlide.background === bg.value ? 'ring-2 ring-primary-500' : 'border-gray-300 dark:border-gray-600'}`}
                      style={{ backgroundColor: bg.value }}
                      onClick={() => onSlideBackgroundChange(currentSlide.id, bg.value)}
                      title={bg.label}
                    />
                  ))}
                  <button 
                    className={`w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600`}
                    title="Custom Color"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">Transition</label>
                <Select 
                  value={currentSlide.transition} 
                  onValueChange={(value) => onSlideTransitionChange(currentSlide.id, value)}
                >
                  <SelectTrigger className="w-full p-1.5 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder="Select transition" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSITION_TYPES.map((transition) => (
                      <SelectItem key={transition.value} value={transition.value}>
                        {transition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">Slide Notes</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs p-0 h-auto"
                    onClick={() => {
                      setShowNotes(!showNotes);
                      if (!showNotes && notesRef.current) {
                        setTimeout(() => notesRef.current?.focus(), 100);
                      }
                    }}
                  >
                    {showNotes ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                {showNotes && (
                  <Textarea
                    ref={notesRef}
                    className="w-full text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Add notes for this slide"
                    value={currentSlide.notes || ''}
                    onChange={(e) => onSlideNotesChange(currentSlide.id, e.target.value)}
                    rows={4}
                  />
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => onDuplicateSlide(currentSlide.id)}
                >
                  Duplicate
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => onDeleteSlide(currentSlide.id)}
                  disabled={slides.length <= 1}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
