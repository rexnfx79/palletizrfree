/**
 * useCalculator Hook - Central State Management
 * 
 * Primary state management hook for the Palletizr Pro application.
 * Coordinates all wizard data, validation, navigation, and calculations.
 * 
 * Architecture:
 * - Centralizes all application state in a single hook
 * - Provides controlled data flow with validation integration
 * - Manages step-by-step navigation with progressive validation
 * - Coordinates calculation execution and result management
 * 
 * State Management Pattern:
 * - Uses React useState for reactive state updates
 * - Implements useCallback for performance optimization
 * - Provides clear separation between data, UI state, and actions
 * - Maintains data persistence across navigation
 * 
 * Integration Points:
 * - calculator.js: Business logic and validation rules
 * - Step components: Form data collection and display
 * - 3D visualization: Result rendering and interaction
 */

import { useState, useCallback } from 'react';
import { 
  validateAllInputs,      // Input validation functions
  generateOptimizationReport, // Main calculation orchestrator
  PALLET_PRESETS,        // Standard pallet configurations
  CONTAINER_PRESETS      // Standard container configurations
} from '../lib/calculator';

/**
 * useCalculator Hook
 * 
 * Central state management hook that provides:
 * - Wizard navigation state and controls
 * - Form data collection and validation
 * - Calculation orchestration and result management
 * - Error handling and user feedback
 * 
 * @returns {Object} State and action functions for the application
 */
export function useCalculator() {
  // =================================================================
  // STATE MANAGEMENT
  // =================================================================
  
  /**
   * Navigation State
   * Tracks current position in the 5-step wizard flow
   */
  const [currentStep, setCurrentStep] = useState(0);
  
  /**
   * Carton Data State
   * Stores carton specifications collected in step 1
   * - Dimensions in centimeters
   * - Weight in kilograms  
   * - Quantity as integer count
   */
  const [cartonData, setCartonData] = useState({
    length: '50',      // Carton length (cm)
    width: '30',       // Carton width (cm) 
    height: '25',      // Carton height (cm)
    weight: '15',      // Carton weight (kg)
    quantity: '200'    // Number of cartons to pack
  });
  
  /**
   * Pallet Data State
   * Stores pallet configuration collected in step 2
   * - Supports preset pallets (Euro, Standard, American) and custom
   * - Dimensions and weight constraints
   */
  const [palletData, setPalletData] = useState({
    preset: 'euro',           // Pallet type preset
    length: '120',            // Pallet length (cm)
    width: '80',              // Pallet width (cm)
    height: '14.5',           // Pallet height (cm)
    maxStackHeight: '200',    // Maximum stack height (cm)
    maxStackWeight: '1000',   // Maximum stack weight (kg)
    usePallets: true          // Whether to use pallets in optimization
  });

  /**
   * Container Data State  
   * Stores container specifications collected in step 3
   * - Supports standard container types (20ft, 40ft, 40ft HC) and custom
   * - Dimensions and weight capacity constraints
   */
  const [containerData, setContainerData] = useState({
    preset: '40ft',           // Container type preset
    length: '1219.2',         // Container length (cm)
    width: '243.8',           // Container width (cm)
    height: '259.1',          // Container height (cm)
    weightCapacity: '26000'   // Maximum weight capacity (kg)
  });

  /**
   * Settings State
   * Stores optimization preferences collected in step 4
   * - Algorithm configuration and constraints
   */
  const [settings, setSettings] = useState({
    enableRotation: true,           // Allow carton rotation for better fit
    preventVerticalRotation: false, // Prevent vertical carton orientation
    considerLoadBearing: false,     // Factor in load-bearing calculations
    stackingPattern: 'auto'         // Stacking algorithm selection
  });

  /**
   * Application State
   * Manages validation, calculation results, and UI state
   */
  const [validationErrors, setValidationErrors] = useState({}); // Form validation errors by category
  const [result, setResult] = useState(null);                   // Optimization calculation results
  const [isCalculating, setIsCalculating] = useState(false);    // Loading state during calculations

  /**
   * Wizard Step Configuration
   * Defines the 5-step workflow for data collection and result display
   */
  const steps = [
    { id: 'carton', title: 'Carton Details', description: 'Enter carton dimensions and quantity' },
    { id: 'pallet', title: 'Pallet Configuration', description: 'Configure pallet settings' },
    { id: 'container', title: 'Container Specifications', description: 'Set container dimensions' },
    { id: 'settings', title: 'Optimization Settings', description: 'Configure calculation preferences' },
    { id: 'results', title: 'Results', description: 'View optimization results' }
  ];

  // =================================================================
  // STATE UPDATE FUNCTIONS
  // =================================================================

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

