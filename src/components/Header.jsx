import { Package, Calculator } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Palletizr Pro</h1>
              <p className="text-xs text-muted-foreground">Container Loading Optimization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <Calculator className="w-4 h-4" />
              <span>Professional Calculator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

