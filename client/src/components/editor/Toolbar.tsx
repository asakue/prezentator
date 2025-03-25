import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Image,
  Square,
  Type,
  LayoutGrid,
  ZapIcon
} from "lucide-react";
import { FONT_FAMILIES, TEXT_STYLES } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import { SlideElement } from "@shared/schema";

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onTemplateLibraryOpen: () => void;
  onAddElement: (element: SlideElement) => void;
  onToggleAnimationsPanel: () => void;
  currentSlideId: string;
  selectedElement: SlideElement | null;
  onSelectedElementUpdate: (updates: Partial<SlideElement>) => void;
}

export function Toolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onTemplateLibraryOpen,
  onAddElement,
  onToggleAnimationsPanel,
  currentSlideId,
  selectedElement,
  onSelectedElementUpdate
}: ToolbarProps) {
  // Add a new text element
  const addTextElement = () => {
    const textElement: SlideElement = {
      id: generateId(),
      type: 'text',
      content: 'Click to edit text',
      style: {
        position: {
          x: 400,
          y: 300
        },
        size: {
          width: 400,
          height: 100
        },
        zIndex: 10,
        color: '#000000',
        fontFamily: 'Inter',
        fontSize: '24px',
        textAlign: 'left'
      }
    };
    
    onAddElement(textElement);
  };
  
  // Add a new image element
  const addImageElement = () => {
    // Show file upload dialog
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const imageElement: SlideElement = {
              id: generateId(),
              type: 'image',
              content: event.target.result as string,
              style: {
                position: {
                  x: 400,
                  y: 300
                },
                size: {
                  width: 400,
                  height: 300
                },
                zIndex: 5
              }
            };
            
            onAddElement(imageElement);
          }
        };
        
        reader.readAsDataURL(file);
      }
    };
    
    fileInput.click();
  };
  
  // Add a new shape element
  const addShapeElement = () => {
    const shapeElement: SlideElement = {
      id: generateId(),
      type: 'shape',
      content: 'rectangle',
      style: {
        position: {
          x: 400,
          y: 300
        },
        size: {
          width: 200,
          height: 150
        },
        zIndex: 5,
        backgroundColor: '#3B82F6',
        borderRadius: '4px'
      }
    };
    
    onAddElement(shapeElement);
  };
  
  // Update text style on selected element
  const updateTextStyle = (property: string, value: string) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    
    onSelectedElementUpdate({
      style: {
        ...selectedElement.style,
        [property]: value
      }
    });
  };
  
  // Determine if text formatting controls should be shown
  const showTextControls = selectedElement && selectedElement.type === 'text';
  
  return (
    <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex-none px-4 py-1">
      <div className="flex space-x-6 overflow-x-auto">
        {/* File Actions */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700" 
            title="Undo (Ctrl+Z)"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700" 
            title="Redo (Ctrl+Y)"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      
        {/* Insert Elements */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={onTemplateLibraryOpen}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Шаблон</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={addImageElement}
          >
            <Image className="h-4 w-4" />
            <span>Изображение</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={addShapeElement}
          >
            <Square className="h-4 w-4" />
            <span>Фигура</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={addTextElement}
          >
            <Type className="h-4 w-4" />
            <span>Текст</span>
          </Button>
        </div>
        
        {/* Text Formatting (only shown when text element is selected) */}
        {showTextControls && (
          <>
            <div className="flex items-center space-x-1">
              <Select 
                value={selectedElement.style.fontWeight || '400'} 
                onValueChange={(value) => updateTextStyle('fontWeight', value)}
              >
                <SelectTrigger className="h-8 w-24">
                  <SelectValue placeholder="Толщина" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Тонкий</SelectItem>
                  <SelectItem value="400">Обычный</SelectItem>
                  <SelectItem value="500">Средний</SelectItem>
                  <SelectItem value="600">Полужирный</SelectItem>
                  <SelectItem value="700">Жирный</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedElement.style.fontFamily || 'Inter'} 
                onValueChange={(value) => updateTextStyle('fontFamily', value)}
              >
                <SelectTrigger className="h-8 w-28">
                  <SelectValue placeholder="Шрифт" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex border border-gray-300 rounded dark:border-gray-600 h-8">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="p-1 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => updateTextStyle('fontSize', `${parseInt(selectedElement.style.fontSize || '24') + 2}px`)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </Button>
                <span className="py-1 px-2 text-sm">
                  {parseInt(selectedElement.style.fontSize || '24')}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="p-1 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => updateTextStyle('fontSize', `${Math.max(8, parseInt(selectedElement.style.fontSize || '24') - 2)}px`)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </div>
            
            {/* Text Alignment */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-1.5 text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => updateTextStyle('textAlign', 'left')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-1.5 text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => updateTextStyle('textAlign', 'center')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-1 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-1.5 text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => updateTextStyle('textAlign', 'right')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm5 5a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm-1 5a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </>
        )}
        
        {/* Animation */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={onToggleAnimationsPanel}
          >
            <ZapIcon className="h-4 w-4" />
            <span>Анимация</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
