import React from 'react';
import { Calculator, Package, Layers, Container, Settings, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCalculator } from './hooks/useCalculator';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { CartonStep } from './components/steps/CartonStep';
import { PalletStep } from './components/steps/PalletStep';
import { ContainerStep } from './components/steps/ContainerStep';
import { SettingsStep } from './components/steps/SettingsStep';
import { Scene3D } from './components/3d/Scene3D';
import './App.css';

function App() {
  const {
    currentStep,
    steps,
    cartonData,
    palletData,
    containerData,
    settings,
    validationErrors,
    result,
    isCalculating,
    updateCartonData,
    updatePalletData,
    updateContainerData,
    updateSettings,
    nextStep,
    prevStep,
    calculateOptimization,
    resetCalculator,
    validateCurrentStep
  } = useCalculator();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CartonStep
            data={cartonData}
            onChange={updateCartonData}
            errors={validationErrors.carton}
          />
        );
      case 1:
        return (
          <PalletStep
            data={palletData}
            onChange={updatePalletData}
            errors={validationErrors.pallet}
          />
        );
      case 2:
        return (
          <ContainerStep
            data={containerData}
            onChange={updateContainerData}
            errors={validationErrors.container}
          />
        );
      case 3:
        return (
          <SettingsStep
            data={settings}
            onChange={updateSettings}
          />
        );
      case 4:
        return (
          <ResultsStep
            result={result}
            onReset={resetCalculator}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 4) return false; // Results step
    return validateCurrentStep();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <div className="max-w-4xl mx-auto">
          {renderCurrentStep()}
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 px-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep === 4 && (
                <button
                  onClick={resetCalculator}
                  className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start Over
                </button>
              )}

              {currentStep === 3 ? (
                <button
                  onClick={calculateOptimization}
                  disabled={isCalculating || !canProceed()}
                  className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 px-8 py-3"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Optimization
                    </>
                  )}
                </button>
              ) : currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 px-6 py-3"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Results Step Component
function ResultsStep({ result, onReset }) {
  if (!result) {
    return (
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6 animate-fade-in-up">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
            <Calculator className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No Results Available</h2>
          <p className="text-muted-foreground">Please complete the calculation process to view results.</p>
        </div>
      </div>
    );
  }

  const { summary, pallet, container } = result;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {summary.efficiency.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Packing Efficiency</div>
          <div className="text-xs text-muted-foreground mt-1">
            {summary.cartonsPlaced} of {summary.totalCartons} cartons
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {summary.spaceUtilization.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Space Utilization</div>
          <div className="text-xs text-muted-foreground mt-1">
            Container volume usage
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {summary.containersUsed}
          </div>
          <div className="text-sm text-muted-foreground">Containers Needed</div>
          <div className="text-xs text-muted-foreground mt-1">
            {summary.palletsUsed} pallets total
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Optimization Results</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Pallet Configuration</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cartons per layer:</span>
                <span className="font-medium">{pallet.result.cartonsPerLayer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maximum layers:</span>
                <span className="font-medium">{pallet.result.maxLayers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cartons per pallet:</span>
                <span className="font-medium">{pallet.result.cartonsPerPallet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Orientation:</span>
                <span className="font-medium capitalize">{pallet.result.orientation}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Container Loading</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pallets per container:</span>
                <span className="font-medium">{container.result.palletsPerContainer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total pallets placed:</span>
                <span className="font-medium">{container.result.totalPalletsPlaced}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining cartons:</span>
                <span className="font-medium">{summary.remainingCartons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pallet orientation:</span>
                <span className="font-medium capitalize">{container.result.orientation}</span>
              </div>
            </div>
          </div>
        </div>

        {summary.remainingCartons > 0 && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                {summary.remainingCartons} cartons could not be optimally placed
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">
              Consider adjusting container size, pallet configuration, or carton dimensions for better efficiency.
            </p>
          </div>
        )}
      </div>

      {/* 3D Visualization */}
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">3D Visualization</h2>
        <Scene3D 
          result={result}
          cartonData={result?.carton}
          palletData={result?.pallet}
          containerData={result?.container}
          settings={result?.settings}
        />
      </div>
    </div>
  );
}

export default App;

