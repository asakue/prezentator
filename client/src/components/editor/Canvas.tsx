import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RenderableElement } from "@/lib/types";
import { SLIDE_ASPECT_RATIO, DEFAULT_CANVAS_WIDTH } from "@/lib/constants";
import { SlideElement } from "@shared/schema";

interface CanvasProps {
  background: string;
  elements: RenderableElement[];
  onElementSelect: (id: string) => void;
  onElementChange: (id: string, updates: Partial<SlideElement>) => void;
  onElementDrag: (id: string, position: { x: number, y: number }) => void;
  onElementResize: (id: string, size: { width: number, height: number }) => void;
  scale: number;
}

export function Canvas({
  background,
  elements,
  onElementSelect,
  onElementChange,
  onElementDrag,
  onElementResize,
  scale
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{ elementId: string, startX: number, startY: number, startLeft: number, startTop: number } | null>(null);
  const [resizeState, setResizeState] = useState<{ elementId: string, startX: number, startY: number, startWidth: number, startHeight: number } | null>(null);

  // Apply scale transformation to canvas
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(${scale})`;
    }
  }, [scale]);

  // Handle mouse down on element
  const handleElementMouseDown = (e: React.MouseEvent, element: RenderableElement) => {
    e.stopPropagation();
    if (!element.isSelected) {
      onElementSelect(element.id);
    }
  };

  // Start dragging an element
  const handleDragStart = (e: React.MouseEvent, element: RenderableElement) => {
    e.stopPropagation();
    e.preventDefault();

    setDragState({
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: element.style.position.x,
      startTop: element.style.position.y
    });

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // Handle drag movement
  const handleDragMove = (e: MouseEvent) => {
    if (!dragState) return;

    // Получаем текущее положение курсора
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Вычисляем разницу между текущим и начальным положением курсора
    const deltaX = currentX - dragState.startX;
    const deltaY = currentY - dragState.startY;

    // Корректируем перемещение с учетом масштаба
    // Делим на масштаб, чтобы элемент перемещался соответственно к визуальному представлению
    const scaledDeltaX = deltaX / scale;
    const scaledDeltaY = deltaY / scale;

    // Вычисляем новые координаты, не позволяя значению быть отрицательным
    const newX = Math.max(0, dragState.startLeft + scaledDeltaX);
    const newY = Math.max(0, dragState.startTop + scaledDeltaY);

    // Применяем новую позицию
    onElementDrag(dragState.elementId, { x: newX, y: newY });
  };

  // End dragging
  const handleDragEnd = () => {
    setDragState(null);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // Start resizing an element
  const handleResizeStart = (e: React.MouseEvent, element: RenderableElement) => {
    e.stopPropagation();
    e.preventDefault();

    setResizeState({
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.style.size.width,
      startHeight: element.style.size.height
    });

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle resize movement
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeState) return;

    // Получаем текущее положение курсора
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Вычисляем разницу между текущим и начальным положением курсора
    const deltaX = currentX - resizeState.startX;
    const deltaY = currentY - resizeState.startY;

    // Корректируем изменение размера с учетом масштаба
    const scaledDeltaX = deltaX / scale;
    const scaledDeltaY = deltaY / scale;

    // Вычисляем новые размеры, убеждаясь, что они не меньше минимально допустимых
    const newWidth = Math.max(50, resizeState.startWidth + scaledDeltaX);
    const newHeight = Math.max(50, resizeState.startHeight + scaledDeltaY);

    // Применяем новые размеры
    onElementResize(resizeState.elementId, { width: newWidth, height: newHeight });
  };

  // End resizing
  const handleResizeEnd = () => {
    setResizeState(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Handle text editing
  const handleTextDoubleClick = (e: React.MouseEvent, element: RenderableElement) => {
    e.stopPropagation();
    if (element.type === 'text') {
      onElementChange(element.id, { isEditing: true });
    }
  };

  // Handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, element: RenderableElement) => {
    if (element.type === 'text') {
      onElementChange(element.id, { content: e.target.value });
    }
  };

  // Determine background style
  const backgroundStyle = background.startsWith('#') || background.startsWith('linear-gradient')
    ? { background }
    : { backgroundColor: background };

  // Handle canvas click (deselect all)
  const handleCanvasClick = () => {
    onElementSelect('');
  };

  // Render an element based on its type
  const renderElement = (element: RenderableElement) => {
    const baseStyles = {
      position: 'absolute' as const,
      left: `${element.style.position.x}px`,
      top: `${element.style.position.y}px`,
      width: `${element.style.size.width}px`,
      height: `${element.style.size.height}px`,
      zIndex: element.style.zIndex,
      transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
    };

    const isSelected = element.isSelected;
    const isEditing = element.isEditing;

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            className={cn(
              "absolute",
              isSelected && "outline outline-2 outline-blue-500 resize-handle"
            )}
            style={{
              ...baseStyles,
              color: element.style.color,
              fontFamily: element.style.fontFamily,
              fontSize: element.style.fontSize,
              fontWeight: element.style.fontWeight,
              textAlign: element.style.textAlign as any,
              cursor: 'move',
              padding: '2px', // Добавляем немного отступа для текста
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onDoubleClick={(e) => handleTextDoubleClick(e, element)}
          >
            {isEditing ? (
              <textarea
                className="w-full h-full bg-transparent resize-none p-2 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none"
                value={element.content}
                onChange={(e) => handleTextChange(e, element)}
                autoFocus
                onBlur={() => onElementChange(element.id, { isEditing: false })}
                placeholder="Введите текст"
                style={{
                  color: element.style.color,
                  fontFamily: element.style.fontFamily,
                  fontSize: element.style.fontSize,
                  fontWeight: element.style.fontWeight,
                  textAlign: element.style.textAlign as any,
                  border: '1px dashed #4B5563',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  lineHeight: '1.3',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflowY: 'auto',
                }}
              />
            ) : (
              <div 
                className="w-full h-full overflow-hidden"
                onMouseDown={(e) => handleDragStart(e, element)}
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.3',
                }}
              >
                {element.content}
              </div>
            )}
            {isSelected && !isEditing && (
              <>
                <div 
                  className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-bl-md cursor-se-resize flex items-center justify-center shadow-md"
                  onMouseDown={(e) => handleResizeStart(e, element)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 9L9 1M5 9L9 5M9 9L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
              </>
            )}
          </div>
        );
        
      case 'image':
        return (
          <div
            key={element.id}
            className={cn(
              "absolute",
              isSelected && "outline outline-2 outline-blue-500 resize-handle"
            )}
            style={baseStyles}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <img
              src={element.content}
              alt="Элемент слайда"
              className="w-full h-full object-cover"
              draggable={false}
              onMouseDown={(e) => handleDragStart(e, element)}
            />
            {isSelected && (
              <>
                <div 
                  className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-bl-md cursor-se-resize flex items-center justify-center shadow-md"
                  onMouseDown={(e) => handleResizeStart(e, element)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 9L9 1M5 9L9 5M9 9L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
              </>
            )}
          </div>
        );
        
      case 'shape':
        const shapeStyles = {
          ...baseStyles,
          backgroundColor: element.style.backgroundColor,
          borderRadius: element.style.borderRadius,
          opacity: element.style.opacity,
        };
        
        return (
          <div
            key={element.id}
            className={cn(
              "absolute",
              isSelected && "outline outline-2 outline-blue-500 resize-handle"
            )}
            style={shapeStyles}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <div 
              className="w-full h-full"
              onMouseDown={(e) => handleDragStart(e, element)}
            />
            {isSelected && (
              <>
                <div 
                  className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-bl-md cursor-se-resize flex items-center justify-center shadow-md"
                  onMouseDown={(e) => handleResizeStart(e, element)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 9L9 1M5 9L9 5M9 9L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
              </>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6"
      onClick={handleCanvasClick}
    >
      <div 
        ref={canvasRef}
        className="slide-canvas canvas-grid shadow-lg relative transform origin-center transition-transform"
        style={{
          ...backgroundStyle,
          width: `${DEFAULT_CANVAS_WIDTH}px`,
          height: `${DEFAULT_CANVAS_WIDTH / SLIDE_ASPECT_RATIO}px`
        }}
      >
        {elements.map(renderElement)}
      </div>
    </div>
  );
}
