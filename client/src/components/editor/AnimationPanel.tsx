import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SlideElement } from "@shared/schema";
import { ANIMATION_TYPES } from "@/lib/constants";

interface AnimationPanelProps {
  element: SlideElement;
  onAnimationChange: (type: string, duration: number, delay: number) => void;
}

export function AnimationPanel({ element, onAnimationChange }: AnimationPanelProps) {
  // Initialize state with existing animation or defaults
  const [animationType, setAnimationType] = useState(
    element.animation?.type || "none"
  );
  const [duration, setDuration] = useState(
    element.animation?.duration || 0.5
  );
  const [delay, setDelay] = useState(
    element.animation?.delay || 0
  );

  // Update animation when element changes
  useEffect(() => {
    if (element.animation) {
      setAnimationType(element.animation.type);
      setDuration(element.animation.duration);
      setDelay(element.animation.delay);
    } else {
      setAnimationType("none");
      setDuration(0.5);
      setDelay(0);
    }
  }, [element]);

  // Handle animation type change
  const handleTypeChange = (value: string) => {
    setAnimationType(value);
    onAnimationChange(value, duration, delay);
  };

  // Handle duration change
  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
    onAnimationChange(animationType, value[0], delay);
  };

  // Handle delay change
  const handleDelayChange = (value: number[]) => {
    setDelay(value[0]);
    onAnimationChange(animationType, duration, value[0]);
  };

  // Preview animation
  const handlePreviewAnimation = () => {
    const previewElement = document.getElementById(`animation-preview-${element.id}`);
    if (previewElement) {
      // Reset animation
      previewElement.style.animation = 'none';
      void previewElement.offsetWidth; // Trigger reflow
      
      // Apply animation
      previewElement.style.animation = `${animationType} ${duration}s ${delay}s forwards`;
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
      <h3 className="font-medium text-gray-800 mb-3 dark:text-gray-200">Animation</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">Animation Type</label>
          <Select value={animationType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full p-1.5 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              {ANIMATION_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">
            Duration: {duration.toFixed(1)}s
          </label>
          <Slider
            min={0.1}
            max={3}
            step={0.1}
            value={[duration]}
            onValueChange={handleDurationChange}
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">
            Delay: {delay.toFixed(1)}s
          </label>
          <Slider
            min={0}
            max={5}
            step={0.1}
            value={[delay]}
            onValueChange={handleDelayChange}
          />
        </div>
        
        <Button 
          onClick={handlePreviewAnimation}
          className="w-full bg-primary-100 text-primary-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
          disabled={animationType === "none"}
        >
          Preview Animation
        </Button>

        {/* Hidden div for animation preview */}
        <div 
          id={`animation-preview-${element.id}`} 
          className="hidden"
        ></div>
      </div>
    </div>
  );
}
