import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SlideElement } from "@shared/schema";
import { Eye, EyeOff, Layers, Move } from "lucide-react";
import { AnimationPanel } from "./AnimationPanel";

interface SidebarProps {
  elements: SlideElement[];
  selectedElementId: string | null;
  onElementSelect: (id: string) => void;
  onElementVisibilityToggle: (id: string) => void;
  onElementDelete: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  showAnimationsPanel: boolean;
  onAnimationChange: (elementId: string, animationType: string, duration: number, delay: number) => void;
}

export function Sidebar({
  elements,
  selectedElementId,
  onElementSelect,
  onElementVisibilityToggle,
  onElementDelete,
  onBringForward,
  onSendBackward,
  showAnimationsPanel,
  onAnimationChange
}: SidebarProps) {
  // Sort elements by z-index from highest to lowest
  const sortedElements = [...elements].sort((a, b) => b.style.zIndex - a.style.zIndex);
  
  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      case 'shape':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V6a3 3 0 00-3-3H6zm1 5a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64 flex-none overflow-y-auto dark:bg-gray-800 dark:border-gray-700 hidden md:block">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Layers</h3>
          <Button 
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-700"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {sortedElements.map((element) => {
            const isSelected = element.id === selectedElementId;
            const baseClassName = "p-2 rounded flex items-center justify-between";
            const selectedClassName = isSelected
              ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              : "bg-gray-50 dark:bg-gray-700";
            
            return (
              <div 
                key={element.id}
                className={`${baseClassName} ${selectedClassName}`}
                onClick={() => onElementSelect(element.id)}
              >
                <div className="flex items-center">
                  {getElementIcon(element.type)}
                  <span className="text-sm truncate max-w-[120px]">
                    {element.type === 'text' 
                      ? element.content.substring(0, 15) + (element.content.length > 15 ? '...' : '')
                      : `${element.type.charAt(0).toUpperCase() + element.type.slice(1)} Element`}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 hover:bg-gray-200 rounded dark:hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementVisibilityToggle(element.id);
                    }}
                    title="Toggle Visibility"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 hover:bg-gray-200 rounded dark:hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBringForward(element.id);
                    }}
                    title="Bring Forward"
                  >
                    <Move className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}

          {elements.length === 0 && (
            <div className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
              No elements on this slide yet. Add elements using the toolbar above.
            </div>
          )}
        </div>
        
        {/* Animation Panel */}
        {showAnimationsPanel && selectedElementId && (
          <AnimationPanel 
            element={elements.find(e => e.id === selectedElementId)!}
            onAnimationChange={(type, duration, delay) => 
              onAnimationChange(selectedElementId, type, duration, delay)
            }
          />
        )}
      </div>
    </div>
  );
}
