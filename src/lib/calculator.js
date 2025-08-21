// Pallet Calculator Logic with Validation
import { create3DLayout } from './3d-layout.js';

export const VALIDATION_RULES = {
  carton: {
    length: { min: 1, max: 500, unit: 'cm' },
    width: { min: 1, max: 500, unit: 'cm' },
    height: { min: 1, max: 500, unit: 'cm' },
    weight: { min: 0.1, max: 1000, unit: 'kg' },
    quantity: { min: 1, max: 10000, unit: 'pieces' }
  },
  pallet: {
    length: { min: 50, max: 200, unit: 'cm' },
    width: { min: 50, max: 200, unit: 'cm' },
    height: { min: 10, max: 50, unit: 'cm' },
    maxStackHeight: { min: 100, max: 300, unit: 'cm' },
    maxStackWeight: { min: 100, max: 2000, unit: 'kg' }
  },
  container: {
    length: { min: 500, max: 1500, unit: 'cm' },
    width: { min: 200, max: 300, unit: 'cm' },
    height: { min: 200, max: 300, unit: 'cm' },
    weightCapacity: { min: 10000, max: 30000, unit: 'kg' }
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
  const { length: cLength, width: cWidth, height: cHeight, weightCapacity } = containerData;
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

