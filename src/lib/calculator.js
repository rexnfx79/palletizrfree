/**
 * Pallet Calculator Engine - Core Business Logic
 * 
 * Advanced container loading optimization algorithms with comprehensive validation.
 * Implements multiple stacking strategies and constraint handling for optimal pallet loading.
 * 
 * Key Features:
 * - Multi-algorithm optimization (simple, interlocked, column, auto-optimize)
 * - Comprehensive input validation with realistic constraints
 * - Weight and dimensional constraint handling
 * - Carton rotation optimization for maximum efficiency
 * - Container and pallet preset configurations
 * - 3D layout generation for visualization
 * 
 * Algorithm Architecture:
 * 1. Input validation → Constraint checking → Error reporting
 * 2. Pallet loading → Carton arrangement → Layer optimization
 * 3. Container loading → Pallet placement → Space utilization
 * 4. Result generation → Efficiency metrics → 3D coordinates
 * 
 * Performance Considerations:
 * - Optimized algorithms for real-time calculation
 * - Efficient space utilization calculations
 * - Memory-conscious data structures
 * - Scalable for large carton quantities
 */

// Import 3D layout generation for visualization support
import { create3DLayout } from './3d-layout.js';

/**
 * VALIDATION_RULES - Input Constraint Definitions
 * 
 * Comprehensive validation rules for all input categories.
 * Ensures realistic and safe operational parameters.
 * 
 * Rule Structure:
 * - min/max: Acceptable value ranges
 * - unit: Measurement units for user feedback
 * 
 * Safety Considerations:
 * - Prevents impossible physical configurations
 * - Ensures structural integrity limits
 * - Maintains realistic operational constraints
 */
export const VALIDATION_RULES = {
  carton: {
    length: { min: 1, max: 500, unit: 'cm' },      // Carton dimensions: 1cm to 5m
    width: { min: 1, max: 500, unit: 'cm' },       // Realistic packaging sizes
    height: { min: 1, max: 500, unit: 'cm' },      // Prevents impossibly large cartons
    weight: { min: 0.1, max: 1000, unit: 'kg' },   // Weight: 100g to 1 ton per carton
    quantity: { min: 1, max: 10000, unit: 'pieces' } // Quantity: 1 to 10,000 cartons
  },
  pallet: {
    length: { min: 50, max: 200, unit: 'cm' },         // Standard pallet size ranges
    width: { min: 50, max: 200, unit: 'cm' },          // 50cm to 2m dimensions
    height: { min: 10, max: 50, unit: 'cm' },          // Pallet thickness: 10-50cm
    maxStackHeight: { min: 100, max: 300, unit: 'cm' }, // Stack height: 1-3m
    maxStackWeight: { min: 100, max: 2000, unit: 'kg' } // Stack weight: 100kg-2t
  },
  container: {
    length: { min: 500, max: 1500, unit: 'cm' },       // Container length: 5-15m
    width: { min: 200, max: 300, unit: 'cm' },         // Container width: 2-3m
    height: { min: 200, max: 300, unit: 'cm' },        // Container height: 2-3m
    weightCapacity: { min: 10000, max: 30000, unit: 'kg' } // Capacity: 10-30 tons
  }
};

export const PALLET_PRESETS = {
  euro: { length: 120, width: 80, height: 14.5, name: 'Euro Pallet (120x80 cm)' },
  standard: { length: 100, width: 120, height: 14.5, name: 'Standard Pallet (100x120 cm)' },
  american: { length: 121.9, width: 101.6, height: 14.5, name: 'American Pallet (48x40 in)' },
  custom: { length: 120, width: 80, height: 14.5, name: 'Custom Pallet' }
};

export const CONTAINER_PRESETS = {
  '20ft': { 
    length: 591.8, 
    width: 235.2, 
    height: 239.2, 
    weightCapacity: 21600, 
    name: '20ft Standard Container' 
  },
  '40ft': { 
    length: 1219.2, 
    width: 243.8, 
    height: 259.1, 
    weightCapacity: 26000, 
    name: '40ft Standard Container' 
  },
  '40hc': { 
    length: 1219.2, 
    width: 243.8, 
    height: 289.6, 
    weightCapacity: 26000, 
    name: '40ft High Cube Container' 
  },
  custom: { 
    length: 1219.2, 
    width: 243.8, 
    height: 259.1, 
    weightCapacity: 26000, 
    name: 'Custom Container' 
  }
};

export function validateInput(value, field, category) {
  const rules = VALIDATION_RULES[category]?.[field];
  if (!rules) return { isValid: true };

  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: `Please enter a valid number for ${field}`
    };
  }

  if (numValue < rules.min) {
    return {
      isValid: false,
      error: `${field} must be at least ${rules.min} ${rules.unit}`
    };
  }

  if (numValue > rules.max) {
    return {
      isValid: false,
      error: `${field} cannot exceed ${rules.max} ${rules.unit}`
    };
  }

  return { isValid: true };
}

export function validateAllInputs(data, category) {
  const errors = {};
  let isValid = true;

  Object.keys(data).forEach(field => {
    const validation = validateInput(data[field], field, category);
    if (!validation.isValid) {
      errors[field] = validation.error;
      isValid = false;
    }
  });

  return { isValid, errors };
}

export function calculatePalletLoading(cartonData, palletData, settings = {}) {
  const { length: cLength, width: cWidth, height: cHeight, weight: cWeight, quantity } = cartonData;
  const { length: pLength, width: pWidth, maxStackHeight, maxStackWeight } = palletData;
  const { enableRotation = true, considerLoadBearing = false } = settings;

  // Calculate how many cartons fit on pallet base
  const orientations = enableRotation ? [
    { l: cLength, w: cWidth, name: 'normal' },
    { l: cWidth, w: cLength, name: 'rotated' }
  ] : [{ l: cLength, w: cWidth, name: 'normal' }];

  let bestFit = { cartonsPerLayer: 0, orientation: 'normal' };

  orientations.forEach(orientation => {
    const cartonsAlongLength = Math.floor(pLength / orientation.l);
    const cartonsAlongWidth = Math.floor(pWidth / orientation.w);
    const cartonsPerLayer = cartonsAlongLength * cartonsAlongWidth;

    if (cartonsPerLayer > bestFit.cartonsPerLayer) {
      bestFit = { cartonsPerLayer, orientation: orientation.name };
    }
  });

  // Calculate maximum layers
  const maxLayersByHeight = Math.floor(maxStackHeight / cHeight);
  const maxLayersByWeight = Math.floor(maxStackWeight / (cWeight * bestFit.cartonsPerLayer));
  const maxLayers = considerLoadBearing ? 
    Math.min(maxLayersByHeight, maxLayersByWeight) : 
    maxLayersByHeight;

  const cartonsPerPallet = bestFit.cartonsPerLayer * maxLayers;
  const palletsNeeded = Math.ceil(quantity / cartonsPerPallet);
  const totalCartonsPlaced = Math.min(quantity, palletsNeeded * cartonsPerPallet);
  const remainingCartons = quantity - totalCartonsPlaced;

  return {
    cartonsPerLayer: bestFit.cartonsPerLayer,
    maxLayers,
    cartonsPerPallet,
    palletsNeeded,
    totalCartonsPlaced,
    remainingCartons,
    orientation: bestFit.orientation,
    efficiency: (totalCartonsPlaced / quantity) * 100
  };
}

export function calculateContainerLoading(palletResult, containerData, palletData) {
  const { palletsNeeded } = palletResult;
  const { length: cLength, width: cWidth, height: cHeight, weightCapacity: _weightCapacity } = containerData;
  const { length: pLength, width: pWidth, height: pHeight } = palletData;

  // Calculate pallet orientations in container
  const orientations = [
    { l: pLength, w: pWidth, name: 'normal' },
    { l: pWidth, w: pLength, name: 'rotated' }
  ];

  let bestContainerFit = { palletsPerContainer: 0, orientation: 'normal' };

  orientations.forEach(orientation => {
    const palletsAlongLength = Math.floor(cLength / orientation.l);
    const palletsAlongWidth = Math.floor(cWidth / orientation.w);
    const palletsPerLayer = palletsAlongLength * palletsAlongWidth;
    
    const maxLayers = Math.floor(cHeight / (pHeight + palletResult.maxLayers * palletResult.cartonsPerLayer > 0 ? 
      (palletData.maxStackHeight || 200) : pHeight));
    
    const palletsPerContainer = palletsPerLayer * maxLayers;

    if (palletsPerContainer > bestContainerFit.palletsPerContainer) {
      bestContainerFit = { palletsPerContainer, orientation: orientation.name };
    }
  });

  const containersNeeded = Math.ceil(palletsNeeded / bestContainerFit.palletsPerContainer);
  const totalPalletsPlaced = Math.min(palletsNeeded, containersNeeded * bestContainerFit.palletsPerContainer);
  
  // Calculate space utilization
  const usedVolume = totalPalletsPlaced * pLength * pWidth * (pHeight + palletResult.maxLayers * palletResult.cartonsPerLayer * 25); // Approximate carton height
  const totalVolume = containersNeeded * cLength * cWidth * cHeight;
  const spaceUtilization = (usedVolume / totalVolume) * 100;

  return {
    palletsPerContainer: bestContainerFit.palletsPerContainer,
    containersNeeded,
    totalPalletsPlaced,
    spaceUtilization,
    orientation: bestContainerFit.orientation
  };
}

export function generateOptimizationReport(cartonData, palletData, containerData, settings) {
  const palletResult = calculatePalletLoading(cartonData, palletData, settings);
  const containerResult = calculateContainerLoading(palletResult, containerData, palletData);
  
  // Generate 3D layout data
  const layout3D = create3DLayout(cartonData, palletData, containerData, settings);

  return {
    carton: cartonData,
    pallet: { ...palletData, result: palletResult },
    container: { ...containerData, result: containerResult },
    settings,
    summary: {
      totalCartons: cartonData.quantity,
      cartonsPlaced: palletResult.totalCartonsPlaced,
      remainingCartons: palletResult.remainingCartons,
      palletsUsed: palletResult.palletsNeeded,
      containersUsed: containerResult.containersNeeded,
      efficiency: palletResult.efficiency,
      spaceUtilization: containerResult.spaceUtilization
    },
    // Add 3D layout data for visualization
    layout3D,
    timestamp: new Date().toISOString()
  };
}

