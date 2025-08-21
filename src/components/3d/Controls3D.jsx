import React, { useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Eye, EyeOff, Layers, Box } from 'lucide-react';

export function Controls3D({ onReset, onToggleView, onToggleLayer, viewMode = 'full' }) {
  const [showPallets, setShowPallets] = useState(true);
  const [showCartons, setShowCartons] = useState(true);
  const [showContainer, setShowContainer] = useState(true);

  const handleTogglePallets = () => {
    setShowPallets(!showPallets);
    onToggleLayer?.('pallets', !showPallets);
  };

  const handleToggleCartons = () => {
    setShowCartons(!showCartons);
    onToggleLayer?.('cartons', !showCartons);
  };

  const handleToggleContainer = () => {
    setShowContainer(!showContainer);
    onToggleLayer?.('container', !showContainer);
  };

  return (
    <div className="absolute top-4 right-4 z-10 bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 p-3 shadow-lg">
      <div className="flex flex-col space-y-2">
        {/* View Controls */}
        <div className="flex items-center space-x-2 pb-2 border-b border-border/30">
          <span className="text-xs font-medium text-muted-foreground">View</span>
        </div>
        
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        {/* Layer Controls */}
        <div className="flex items-center space-x-2 pt-2 border-t border-border/30">
          <span className="text-xs font-medium text-muted-foreground">Layers</span>
        </div>

        <button
          onClick={handleToggleContainer}
          className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            showContainer 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary hover:bg-secondary/80'
          }`}
          title="Toggle Container"
        >
          <Box className="w-4 h-4" />
          <span>Container</span>
          {showContainer ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>

        <button
          onClick={handleTogglePallets}
          className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            showPallets 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary hover:bg-secondary/80'
          }`}
          title="Toggle Pallets"
        >
          <Layers className="w-4 h-4" />
          <span>Pallets</span>
          {showPallets ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>

        <button
          onClick={handleToggleCartons}
          className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            showCartons 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary hover:bg-secondary/80'
          }`}
          title="Toggle Cartons"
        >
          <Move3D className="w-4 h-4" />
          <span>Cartons</span>
          {showCartons ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
        </button>

        {/* Instructions */}
        <div className="pt-2 border-t border-border/30">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Drag to rotate</div>
            <div>• Scroll to zoom</div>
            <div>• Right-click to pan</div>
          </div>
        </div>
      </div>
    </div>
  );
}

