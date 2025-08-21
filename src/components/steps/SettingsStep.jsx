import { CheckboxField, SelectField } from '../FormField';
import { Settings, RotateCw, Weight, Layers3 } from 'lucide-react';

export function SettingsStep({ data, onChange }) {
  const stackingPatternOptions = [
    { value: 'auto', label: 'Auto-Optimize (Recommended)' },
    { value: 'simple', label: 'Simple Stacking' },
    { value: 'interlock', label: 'Interlocked Pattern' },
    { value: 'column', label: 'Column Stacking' }
  ];

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6 animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-xl">
          <Settings className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Optimization Settings</h2>
          <p className="text-sm text-muted-foreground">Configure how the optimization algorithm should behave</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Rotation Settings */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
            <RotateCw className="w-4 h-4 mr-2" />
            Rotation Options
          </h3>
          <div className="space-y-4">
            <CheckboxField
              label="Enable Pallet Rotation"
              checked={data.enableRotation}
              onChange={(value) => onChange('enableRotation', value)}
              description="Allow pallets to be rotated 90° to find the best fit in the container"
              tooltip="Enabling rotation often improves space utilization but may affect loading/unloading access"
            />

            <CheckboxField
              label="Prevent Vertical Rotation (This Side Up)"
              checked={data.preventVerticalRotation}
              onChange={(value) => onChange('preventVerticalRotation', value)}
              description="Prevent cartons from being rotated vertically to maintain proper orientation"
              tooltip="Enable this for fragile items or products with specific orientation requirements"
            />
          </div>
        </div>

        {/* Weight and Load Bearing */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
            <Weight className="w-4 h-4 mr-2" />
            Weight Considerations
          </h3>
          <div className="space-y-4">
            <CheckboxField
              label="Consider Load Bearing Capacity"
              checked={data.considerLoadBearing}
              onChange={(value) => onChange('considerLoadBearing', value)}
              description="Factor in the ability of cartons to support weight when stacking"
              tooltip="Important for fragile items or when stacking heavy cartons on lighter ones"
            />
          </div>
        </div>

        {/* Stacking Pattern */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
            <Layers3 className="w-4 h-4 mr-2" />
            Stacking Pattern
          </h3>
          <SelectField
            label="Stacking Algorithm"
            value={data.stackingPattern}
            onChange={(value) => onChange('stackingPattern', value)}
            options={stackingPatternOptions}
            tooltip="Choose how cartons should be arranged on pallets for optimal stability"
          />
          
          <div className="mt-4 text-xs text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-medium">Auto-Optimize:</span> Automatically selects the best pattern
              </div>
              <div>
                <span className="font-medium">Simple:</span> Basic row-by-row stacking
              </div>
              <div>
                <span className="font-medium">Interlock:</span> Alternating pattern for stability
              </div>
              <div>
                <span className="font-medium">Column:</span> Vertical alignment for easy access
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Optimization Tips</h4>
              <ul className="text-xs text-blue-700 dark:text-blue-200 mt-1 space-y-1">
                <li>• Auto-optimize is recommended for most scenarios</li>
                <li>• Enable rotation for better space utilization</li>
                <li>• Consider load bearing for fragile or mixed-weight shipments</li>
                <li>• Use "This Side Up" for products with orientation requirements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="p-4 bg-secondary/50 rounded-xl">
          <h3 className="text-sm font-medium text-foreground mb-3">Current Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rotation:</span>
              <span className="font-medium">{data.enableRotation ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vertical Lock:</span>
              <span className="font-medium">{data.preventVerticalRotation ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Load Bearing:</span>
              <span className="font-medium">{data.considerLoadBearing ? 'Considered' : 'Ignored'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pattern:</span>
              <span className="font-medium">{stackingPatternOptions.find(opt => opt.value === data.stackingPattern)?.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

