import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";
import { X } from "lucide-react";

interface TemplateLibraryProps {
  onClose: () => void;
  onApplyTemplate: (slides: any[]) => void;
}

export function TemplateLibrary({ onClose, onApplyTemplate }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Filter templates by category
  const filteredTemplates = selectedCategory === "all"
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  // Handle template application
  const handleApply = () => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        onApplyTemplate(template.slides);
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col dark:bg-gray-800">
        <DialogHeader className="border-b border-gray-200 p-4 flex justify-between items-center dark:border-gray-700">
          <DialogTitle className="font-heading font-bold text-xl">Template Library</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            {TEMPLATE_CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className={
                  selectedCategory === category.value
                    ? "px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium"
                    : "px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium dark:bg-gray-700 dark:hover:bg-gray-600"
                }
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`border ${
                  selectedTemplate === template.id
                    ? "border-primary-500"
                    : "border-gray-200 dark:border-gray-700"
                } rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div 
                  className="aspect-video p-4 flex items-center justify-center"
                  style={
                    template.thumbnail.startsWith('#') || template.thumbnail.startsWith('linear-gradient')
                      ? { background: template.thumbnail }
                      : { backgroundColor: template.thumbnail }
                  }
                >
                  <div className="bg-white/90 backdrop-blur-sm w-2/3 p-3 rounded-lg text-center dark:bg-gray-800/90">
                    <div className="w-full h-2 bg-gray-300 mb-2 dark:bg-gray-600"></div>
                    <div className="w-full h-6 bg-gray-400 dark:bg-gray-500"></div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 flex justify-end dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium mr-2 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!selectedTemplate}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm font-medium"
          >
            Apply Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
