import { AlertCircle, HelpCircle } from 'lucide-react';

export function FormField({ 
  label, 
  value, 
  onChange, 
  error, 
  type = 'text', 
  placeholder, 
  unit, 
  tooltip,
  required = false,
  min,
  max,
  step
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover" />
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full rounded-xl border border-border bg-input px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 ease-out ${error ? 'border-destructive focus:ring-destructive' : ''} ${
            unit ? 'pr-12' : ''
          }`}
        />
        
        {unit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm animate-fade-in-up">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export function SelectField({ 
  label, 
  value, 
  onChange, 
  options, 
  error, 
  tooltip,
  required = false 
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover" />
            </div>
          </div>
        )}
      </div>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-border bg-input px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 ease-out appearance-none bg-no-repeat bg-right bg-[length:16px_16px] pr-10 ${error ? 'border-destructive focus:ring-destructive' : ''}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm animate-fade-in-up">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export function CheckboxField({ 
  label, 
  checked, 
  onChange, 
  description,
  tooltip 
}) {
  return (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded-md border-2 border-border bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 ease-out checked:bg-primary checked:border-primary mt-0.5"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </label>
          {tooltip && (
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover" />
              </div>
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

