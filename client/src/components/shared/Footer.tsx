import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-4 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <span>© 2025 Презентатор</span>
          <span className="mx-2">|</span>
          <a 
            href="https://github.com/asakue" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:text-primary-500 transition-colors"
          >
            <Github className="h-4 w-4 mr-1" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}