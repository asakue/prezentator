import { useState, useEffect, useRef } from "react";
import { Slide } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PresentationModeProps {
  slides: Slide[];
  startIndex: number;
  onClose: () => void;
  onSlideRef: (index: number, ref: HTMLDivElement | null) => void;
}

export function PresentationMode({ slides, startIndex, onClose, onSlideRef }: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Register keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent scrolling with space key
    const handleSpaceBar = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleSpaceBar);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleSpaceBar);
    };
  }, [currentIndex, slides.length, onClose]);

  // Handle navigation
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  // Provide slide refs for PDF export
  useEffect(() => {
    slides.forEach((_, index) => {
      if (slideRefs.current[index]) {
        onSlideRef(index, slideRefs.current[index]);
      }
    });
  }, [slides, onSlideRef]);

  // Get current slide
  const currentSlide = slides[currentIndex];

  // Set ref for current slide
  const setSlideRef = (index: number, ref: HTMLDivElement | null) => {
    slideRefs.current[index] = ref;
    onSlideRef(index, ref);
  };

  // Apply transition style for slide
  const getTransitionStyle = (slide: Slide) => {
    switch (slide.transition) {
      case 'fade':
        return 'animate-fadeIn';
      case 'slide':
        return 'animate-slideIn';
      case 'zoom':
        return 'scale-in-center';
      default:
        return '';
    }
  };

  // Render elements for the current slide
  const renderElements = (slide: Slide) => {
    return slide.elements.map(element => {
      const baseStyles = {
        position: 'absolute' as const,
        left: `${element.style.position.x}px`,
        top: `${element.style.position.y}px`,
        width: `${element.style.size.width}px`,
        height: `${element.style.size.height}px`,
        zIndex: element.style.zIndex,
        transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
        opacity: element.style.opacity !== undefined ? element.style.opacity : 1,
      };

      // Animation styles
      const animationStyle = element.animation ? {
        animation: `${element.animation.type} ${element.animation.duration}s ${element.animation.delay}s forwards`,
        opacity: element.animation.type !== 'none' ? 0 : 1,
      } : {};

      switch (element.type) {
        case 'text':
          return (
            <div
              key={element.id}
              style={{
                ...baseStyles,
                ...animationStyle,
                color: element.style.color,
                fontFamily: element.style.fontFamily,
                fontSize: element.style.fontSize,
                fontWeight: element.style.fontWeight,
                textAlign: element.style.textAlign as any,
              }}
            >
              {element.content}
            </div>
          );
          
        case 'image':
          return (
            <div
              key={element.id}
              style={{
                ...baseStyles,
                ...animationStyle,
              }}
            >
              <img
                src={element.content}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          );
          
        case 'shape':
          return (
            <div
              key={element.id}
              style={{
                ...baseStyles,
                ...animationStyle,
                backgroundColor: element.style.backgroundColor,
                borderRadius: element.style.borderRadius,
              }}
            />
          );
          
        default:
          return null;
      }
    });
  };

  // Determine background style
  const getBackgroundStyle = (background: string) => {
    return background.startsWith('#') || background.startsWith('linear-gradient')
      ? { background }
      : { backgroundColor: background };
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="w-full max-w-5xl aspect-video bg-white relative shadow-2xl dark:bg-gray-800">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(ref) => setSlideRef(index, ref)}
            className={`absolute inset-0 ${getTransitionStyle(slide)}`}
            style={{
              ...getBackgroundStyle(slide.background),
              display: index === currentIndex ? 'block' : 'none',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-12">
              {renderElements(slide)}
            </div>
          </div>
        ))}
        
        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/70 backdrop-blur-sm dark:bg-white/10 dark:hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === slides.length - 1}
            className="p-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/70 backdrop-blur-sm dark:bg-white/10 dark:hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="p-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/70 backdrop-blur-sm dark:bg-white/10 dark:hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Slide counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-gray-800/70 text-white rounded backdrop-blur-sm text-sm dark:bg-white/10">
          {currentIndex + 1} / {slides.length}
        </div>

        {/* Slide notes (if available) */}
        {currentSlide.notes && (
          <div className="absolute top-4 left-4 right-4 px-3 py-1 bg-gray-800/70 text-white rounded backdrop-blur-sm text-sm dark:bg-white/10 max-w-md truncate">
            Note: {currentSlide.notes}
          </div>
        )}
      </div>
    </div>
  );
}
