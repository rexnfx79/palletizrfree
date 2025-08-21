import { FormField, SelectField, CheckboxField } from '../FormField';
import { PALLET_PRESETS } from '../../lib/calculator';
import { Layers, Truck, Settings } from 'lucide-react';

export function PalletStep({ data, onChange, errors = {} }) {
  const presetOptions = Object.entries(PALLET_PRESETS).map(([key, preset]) => ({
    value: key,
    label: preset.name
  }));

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6 animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-xl">
          <Layers className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Pallet Configuration</h2>
          <p className="text-sm text-muted-foreground">Configure your pallet specifications and stacking preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Use Pallets Toggle */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <CheckboxField
            label="Use Pallets for Loading"
            checked={data.usePallets}
            onChange={(value) => onChange('usePallets', value)}
            description="Enable to pack cartons onto pallets before loading into container. Disable for direct container loading."
            tooltip="Palletized loading is recommended for most shipments as it improves handling and organization"
          />
        </div>

        {data.usePallets && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <SelectField
                  label="Pallet Type"
                  value={data.preset}
                  onChange={(value) => onChange('preset', value)}
                  options={presetOptions}
                  required
                  tooltip="Choose a standard pallet size or select custom to enter your own dimensions"
                />

                <FormField
                  label="Pallet Length"
                  value={data.length}
                  onChange={(value) => onChange('length', value)}
                  error={errors.length}
                  type="number"
                  placeholder="120"
                  unit="cm"
                  min="50"
                  max="200"
                  step="0.1"
                  required
                  tooltip="The length of the pallet base"
                />

                <FormField
                  label="Pallet Width"
                  value={data.width}
                  onChange={(value) => onChange('width', value)}
                  error={errors.width}
                  type="number"
                  placeholder="80"
                  unit="cm"
                  min="50"
                  max="200"
                  step="0.1"
                  required
                  tooltip="The width of the pallet base"
                />

                <FormField
                  label="Pallet Height"
                  value={data.height}
                  onChange={(value) => onChange('height', value)}
                  error={errors.height}
                  type="number"
                  placeholder="14.5"
                  unit="cm"
                  min="10"
                  max="50"
                  step="0.1"
                  required
                  tooltip="The height of the pallet itself (not including stacked cartons)"
                />
              </div>

              <div className="space-y-4">
                <FormField
                  label="Maximum Stack Height"
                  value={data.maxStackHeight}
                  onChange={(value) => onChange('maxStackHeight', value)}
                  error={errors.maxStackHeight}
                  type="number"
                  placeholder="200"
                  unit="cm"
                  min="100"
                  max="300"
                  step="1"
                  required
                  tooltip="Maximum height for stacking cartons on the pallet (including pallet height)"
                />

                <FormField
                  label="Maximum Stack Weight"
                  value={data.maxStackWeight}
                  onChange={(value) => onChange('maxStackWeight', value)}
                  error={errors.maxStackWeight}
                  type="number"
                  placeholder="1000"
                  unit="kg"
                  min="100"
                  max="2000"
                  step="10"
                  required
                  tooltip="Maximum weight that can be stacked on one pallet"
                />

                {/* Pallet Preview */}
                <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Pallet Summary
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Area:</span>
                      <span className="font-medium">
                        {data.length && data.width 
                          ? (parseFloat(data.length) * parseFloat(data.width) / 10000).toFixed(2)
                          : '0'
                        } m²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available Height:</span>
                      <span className="font-medium">
                        {data.maxStackHeight && data.height 
                          ? (parseFloat(data.maxStackHeight) - parseFloat(data.height)).toFixed(1)
                          : '0'
                        } cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight Capacity:</span>
                      <span className="font-medium">{data.maxStackWeight || '0'} kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-amber-500 rounded-full flex-shrink-0 mt-0.5">
                  <Truck className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">Pallet Guidelines</h4>
                  <ul className="text-xs text-amber-700 dark:text-amber-200 mt-1 space-y-1">
                    <li>• Euro pallets (120×80 cm) are most common in Europe</li>
                    <li>• American pallets (48×40 in / 121.9×101.6 cm) are standard in North America</li>
                    <li>• Consider weight distribution and stability when stacking</li>
                    <li>• Leave clearance for forklift access and handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

