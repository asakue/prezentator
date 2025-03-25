import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Footer } from "@/components/shared/Footer";
import { Plus, FileText, Trash2 } from "lucide-react";
import { Presentation } from "@shared/schema";
import { STORAGE_KEY } from "@/lib/constants";
import { formatDate, generateId } from "@/lib/utils";
import { createEmptyPresentation } from "@/lib/templates";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Home() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [newPresentationTitle, setNewPresentationTitle] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [, navigate] = useLocation();

  // Load saved presentations from localStorage
  useEffect(() => {
    const savedPresentations = localStorage.getItem(STORAGE_KEY);
    if (savedPresentations) {
      setPresentations(JSON.parse(savedPresentations));
    }
  }, []);

  // Create a new presentation
  const createPresentation = () => {
    const title = newPresentationTitle.trim() || "Untitled Presentation";
    const newPresentation = createEmptyPresentation(title);
    
    // Save to localStorage
    const updatedPresentations = [...presentations, newPresentation];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPresentations));
    
    // Reset and navigate to editor
    setNewPresentationTitle("");
    setIsCreatingNew(false);
    navigate(`/editor/${newPresentation.id}`);
  };

  // Delete a presentation
  const deletePresentation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const updatedPresentations = presentations.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPresentations));
    setPresentations(updatedPresentations);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card flex items-center justify-between py-2 px-4 h-14">
        <h1 className="font-heading font-bold text-xl text-primary">
          Презен<span className="text-accent-500">татор</span>
        </h1>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Мои презентации</h2>
          <Button onClick={() => setIsCreatingNew(true)}>
            <Plus className="mr-2 h-4 w-4" /> Новая презентация
          </Button>
        </div>

        {presentations.length === 0 ? (
          <div className="text-center py-16 bg-accent/5 rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Презентаций пока нет</h3>
            <p className="text-muted-foreground mb-6">Создайте свою первую презентацию, чтобы начать работу</p>
            <Button onClick={() => setIsCreatingNew(true)}>
              <Plus className="mr-2 h-4 w-4" /> Создать презентацию
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation) => (
              <Card 
                key={presentation.id} 
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate(`/editor/${presentation.id}`)}
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                    {/* Thumbnail/Preview would go here */}
                    <div className="text-2xl font-bold text-muted-foreground">{presentation.title.charAt(0)}</div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium truncate">{presentation.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(presentation.updated)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => deletePresentation(presentation.id, e)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create New Dialog */}
      <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новую презентацию</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Название презентации"
              value={newPresentationTitle}
              onChange={(e) => setNewPresentationTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') createPresentation();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingNew(false)}>
              Отмена
            </Button>
            <Button onClick={createPresentation}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
