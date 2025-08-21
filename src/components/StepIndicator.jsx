import { Check } from 'lucide-react';

export function StepIndicator({ steps, currentStep }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-border text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 mt-[-24px]">
                <div className={`h-0.5 ${
                  index < currentStep ? 'bg-green-500' : 'bg-border'
                } transition-colors duration-300`} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
      </div>
    </div>
  );
}

