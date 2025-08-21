import { FormField, SelectField } from '../FormField';
import { CONTAINER_PRESETS } from '../../lib/calculator';
import { Container, Ship, Info } from 'lucide-react';

export function ContainerStep({ data, onChange, errors = {} }) {
  const presetOptions = Object.entries(CONTAINER_PRESETS).map(([key, preset]) => ({
    value: key,
    label: preset.name
  }));

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6 animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-500/10 rounded-xl">
          <Container className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Container Specifications</h2>
          <p className="text-sm text-muted-foreground">Define the container dimensions and weight capacity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SelectField
            label="Container Type"
            value={data.preset}
            onChange={(value) => onChange('preset', value)}
            options={presetOptions}
            required
            tooltip="Choose a standard container size or select custom to enter your own dimensions"
          />

          <FormField
            label="Internal Length"
            value={data.length}
            onChange={(value) => onChange('length', value)}
            error={errors.length}
            type="number"
            placeholder="1219.2"
            unit="cm"
            min="500"
            max="1500"
            step="0.1"
            required
            tooltip="Internal length of the container (usable space)"
          />

          <FormField
            label="Internal Width"
            value={data.width}
            onChange={(value) => onChange('width', value)}
            error={errors.width}
            type="number"
            placeholder="243.8"
            unit="cm"
            min="200"
            max="300"
            step="0.1"
            required
            tooltip="Internal width of the container (usable space)"
          />
        </div>

        <div className="space-y-4">
          <FormField
            label="Internal Height"
            value={data.height}
            onChange={(value) => onChange('height', value)}
            error={errors.height}
            type="number"
            placeholder="259.1"
            unit="cm"
            min="200"
            max="300"
            step="0.1"
            required
            tooltip="Internal height of the container (usable space)"
          />

          <FormField
            label="Weight Capacity"
            value={data.weightCapacity}
            onChange={(value) => onChange('weightCapacity', value)}
            error={errors.weightCapacity}
            type="number"
            placeholder="26000"
            unit="kg"
            min="10000"
            max="30000"
            step="100"
            required
            tooltip="Maximum payload weight the container can carry"
          />

          {/* Container Preview */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Container Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="font-medium">
                  {data.length || '0'} × {data.width || '0'} × {data.height || '0'} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-medium">
                  {data.length && data.width && data.height 
                    ? (parseFloat(data.length) * parseFloat(data.width) * parseFloat(data.height) / 1000000).toFixed(1)
                    : '0'
                  } m³
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Floor Area:</span>
                <span className="font-medium">
                  {data.length && data.width 
                    ? (parseFloat(data.length) * parseFloat(data.width) / 10000).toFixed(1)
                    : '0'
                  } m²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight Limit:</span>
                <span className="font-medium">{data.weightCapacity || '0'} kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">20ft Container</span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-200">
            5.9m × 2.35m × 2.39m<br />
            Max payload: 21.6 tons
          </p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-900 dark:text-green-100">40ft Container</span>
          </div>
          <p className="text-xs text-green-700 dark:text-green-200">
            12.2m × 2.44m × 2.59m<br />
            Max payload: 26.0 tons
          </p>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">40ft High Cube</span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-200">
            12.2m × 2.44m × 2.90m<br />
            Max payload: 26.0 tons
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-6 h-6 bg-slate-500 rounded-full flex-shrink-0 mt-0.5">
            <Ship className="w-3 h-3 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Container Guidelines</h4>
            <ul className="text-xs text-slate-700 dark:text-slate-200 mt-1 space-y-1">
              <li>• Dimensions shown are internal usable space</li>
              <li>• Consider door opening restrictions for loading</li>
              <li>• Weight limits include container tare weight</li>
              <li>• High cube containers offer 30cm additional height</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

