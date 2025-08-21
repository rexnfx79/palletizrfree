import { useState, useCallback } from 'react';
import { 
  validateAllInputs, 
  generateOptimizationReport,
  PALLET_PRESETS,
  CONTAINER_PRESETS 
} from '../lib/calculator';

export function useCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cartonData, setCartonData] = useState({
    length: '50',
    width: '30',
    height: '25',
    weight: '15',
    quantity: '200'
  });
  
  const [palletData, setPalletData] = useState({
    preset: 'euro',
    length: '120',
    width: '80',
    height: '14.5',
    maxStackHeight: '200',
    maxStackWeight: '1000',
    usePallets: true
  });

  const [containerData, setContainerData] = useState({
    preset: '40ft',
    length: '1219.2',
    width: '243.8',
    height: '259.1',
    weightCapacity: '26000'
  });

  const [settings, setSettings] = useState({
    enableRotation: true,
    preventVerticalRotation: false,
    considerLoadBearing: false,
    stackingPattern: 'auto'
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const steps = [
    { id: 'carton', title: 'Carton Details', description: 'Enter carton dimensions and quantity' },
    { id: 'pallet', title: 'Pallet Configuration', description: 'Configure pallet settings' },
    { id: 'container', title: 'Container Specifications', description: 'Set container dimensions' },
    { id: 'settings', title: 'Optimization Settings', description: 'Configure calculation preferences' },
    { id: 'results', title: 'Results', description: 'View optimization results' }
  ];

  const updateCartonData = useCallback((field, value) => {
    setCartonData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors.carton?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        carton: { ...prev.carton, [field]: undefined }
      }));
    }
  }, [validationErrors]);

  const updatePalletData = useCallback((field, value) => {
    setPalletData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If preset changed, update dimensions
      if (field === 'preset' && value !== 'custom') {
        const preset = PALLET_PRESETS[value];
        if (preset) {
          Object.assign(newData, {
            length: preset.length.toString(),
            width: preset.width.toString(),
            height: preset.height.toString()
          });
        }
      }
      
      return newData;
    });

    // Clear validation error for this field
    if (validationErrors.pallet?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        pallet: { ...prev.pallet, [field]: undefined }
      }));
    }
  }, [validationErrors]);

  const updateContainerData = useCallback((field, value) => {
    setContainerData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If preset changed, update dimensions
      if (field === 'preset' && value !== 'custom') {
        const preset = CONTAINER_PRESETS[value];
        if (preset) {
          Object.assign(newData, {
            length: preset.length.toString(),
            width: preset.width.toString(),
            height: preset.height.toString(),
            weightCapacity: preset.weightCapacity.toString()
          });
        }
      }
      
      return newData;
    });

    // Clear validation error for this field
    if (validationErrors.container?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        container: { ...prev.container, [field]: undefined }
      }));
    }
  }, [validationErrors]);

  const updateSettings = useCallback((field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateCurrentStep = useCallback(() => {
    const stepData = {
      0: { data: cartonData, category: 'carton' },
      1: { data: palletData, category: 'pallet' },
      2: { data: containerData, category: 'container' },
      3: { data: {}, category: 'settings' }
    };

    const { data, category } = stepData[currentStep] || {};
    if (!data) return true;

    // Filter out non-numeric fields for validation
    const numericFields = Object.keys(data).filter(key => 
      !['preset', 'usePallets'].includes(key)
    );
    
    const numericData = {};
    numericFields.forEach(key => {
      numericData[key] = data[key];
    });

    const validation = validateAllInputs(numericData, category);
    
    if (!validation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        [category]: validation.errors
      }));
      return false;
    }

    return true;
  }, [currentStep, cartonData, palletData, containerData]);

  const nextStep = useCallback(() => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, validateCurrentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  }, [steps.length]);

  const calculateOptimization = useCallback(async () => {
    setIsCalculating(true);
    
    try {
      // Simulate calculation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cartonNumeric = {
        length: parseFloat(cartonData.length),
        width: parseFloat(cartonData.width),
        height: parseFloat(cartonData.height),
        weight: parseFloat(cartonData.weight),
        quantity: parseInt(cartonData.quantity)
      };

      const palletNumeric = {
        length: parseFloat(palletData.length),
        width: parseFloat(palletData.width),
        height: parseFloat(palletData.height),
        maxStackHeight: parseFloat(palletData.maxStackHeight),
        maxStackWeight: parseFloat(palletData.maxStackWeight)
      };

      const containerNumeric = {
        length: parseFloat(containerData.length),
        width: parseFloat(containerData.width),
        height: parseFloat(containerData.height),
        weightCapacity: parseFloat(containerData.weightCapacity)
      };

      const optimizationResult = generateOptimizationReport(
        cartonNumeric,
        palletNumeric,
        containerNumeric,
        settings
      );

      setResult(optimizationResult);
      setCurrentStep(4); // Go to results step
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [cartonData, palletData, containerData, settings]);

  const resetCalculator = useCallback(() => {
    setCurrentStep(0);
    setResult(null);
    setValidationErrors({});
    setIsCalculating(false);
  }, []);

  return {
    // State
    currentStep,
    steps,
    cartonData,
    palletData,
    containerData,
    settings,
    validationErrors,
    result,
    isCalculating,
    
    // Actions
    updateCartonData,
    updatePalletData,
    updateContainerData,
    updateSettings,
    nextStep,
    prevStep,
    goToStep,
    calculateOptimization,
    resetCalculator,
    validateCurrentStep
  };
}

