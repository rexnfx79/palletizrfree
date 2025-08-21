import { FormField } from '../FormField';
import { Package, Ruler, Weight, Hash } from 'lucide-react';

export function CartonStep({ data, onChange, errors = {} }) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6 animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Carton Specifications</h2>
          <p className="text-sm text-muted-foreground">Enter the dimensions and details of your cartons</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            label="Length"
            value={data.length}
            onChange={(value) => onChange('length', value)}
            error={errors.length}
            type="number"
            placeholder="50"
            unit="cm"
            min="1"
            max="500"
            step="0.1"
            required
            tooltip="The longest dimension of your carton"
          />

          <FormField
            label="Width"
            value={data.width}
            onChange={(value) => onChange('width', value)}
            error={errors.width}
            type="number"
            placeholder="30"
            unit="cm"
            min="1"
            max="500"
            step="0.1"
            required
            tooltip="The width dimension of your carton"
          />

          <FormField
            label="Height"
            value={data.height}
            onChange={(value) => onChange('height', value)}
            error={errors.height}
            type="number"
            placeholder="25"
            unit="cm"
            min="1"
            max="500"
            step="0.1"
            required
            tooltip="The height dimension of your carton"
          />
        </div>

        <div className="space-y-4">
          <FormField
            label="Weight per Carton"
            value={data.weight}
            onChange={(value) => onChange('weight', value)}
            error={errors.weight}
            type="number"
            placeholder="15"
            unit="kg"
            min="0.1"
            max="1000"
            step="0.1"
            required
            tooltip="The weight of each individual carton"
          />

          <FormField
            label="Total Quantity"
            value={data.quantity}
            onChange={(value) => onChange('quantity', value)}
            error={errors.quantity}
            type="number"
            placeholder="200"
            unit="pieces"
            min="1"
            max="10000"
            step="1"
            required
            tooltip="Total number of cartons to be loaded"
          />

          {/* Visual Preview */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Ruler className="w-4 h-4 mr-2" />
              Carton Preview
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="font-medium">{data.length || '0'} × {data.width || '0'} × {data.height || '0'} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-medium">
                  {data.length && data.width && data.height 
                    ? (parseFloat(data.length) * parseFloat(data.width) * parseFloat(data.height) / 1000).toFixed(1)
                    : '0'
                  } L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight:</span>
                <span className="font-medium">{data.weight || '0'} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Weight:</span>
                <span className="font-medium">
                  {data.weight && data.quantity 
                    ? (parseFloat(data.weight) * parseInt(data.quantity)).toFixed(1)
                    : '0'
                  } kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Tips for accurate measurements</h4>
            <ul className="text-xs text-blue-700 dark:text-blue-200 mt-1 space-y-1">
              <li>• Measure the outer dimensions of your carton including any packaging</li>
              <li>• Include the weight of the carton itself, not just the contents</li>
              <li>• Round up measurements to account for handling clearance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

