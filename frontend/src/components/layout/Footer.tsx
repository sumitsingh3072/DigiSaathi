import { Heart, Code } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background/50 border-t border-border/60 w-full py-4 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DigiSaathi. All rights reserved.</p>
        <p className="flex items-center gap-1.5 mt-2 sm:mt-0">
          Made with <Heart className="h-4 w-4 text-red-500" /> for MumbaiHacks
          <Code className="h-4 w-4 text-green-500" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
