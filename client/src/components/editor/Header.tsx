import { useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, FileDown, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onPresentationStart: () => void;
  onExportPdf: () => void;
  onExportHtml: () => void;
}

export function Header({ 
  title, 
  onTitleChange, 
  onPresentationStart, 
  onExportPdf,
  onExportHtml
}: HeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    onTitleChange(titleValue);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between py-2 px-4 h-14">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <h1 className="font-heading font-bold text-xl text-primary-600 dark:text-primary-400">
          Презен<span className="text-accent-500">татор</span>
        </h1>
        
        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700" 
            title="Новая презентация"
          >
            <Link href="/">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
              </svg>
            </Link>
          </Button>
        </div>
        
        <div className="hidden lg:block">
          {isEditingTitle ? (
            <Input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
          ) : (
            <div 
              onClick={() => setIsEditingTitle(true)}
              className="border border-transparent hover:border-gray-300 rounded px-2 py-1 text-sm cursor-pointer dark:hover:border-gray-600"
            >
              {title}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          onClick={onPresentationStart} 
          className="hidden sm:flex items-center space-x-1 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
        >
          <PlayCircle className="h-4 w-4" />
          <span>Запустить</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-1.5 text-gray-700 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700" 
              title="Экспорт"
            >
              <FileDown className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Экспортировать как</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExportPdf}>PDF документ</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportHtml}>HTML презентация</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
