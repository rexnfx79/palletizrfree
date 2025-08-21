/**
 * 3D Layout Algorithm for Palletizr Pro
 * Calculates optimal positioning of cartons on pallets and pallets in containers
 */

export class Layout3D {
  constructor(cartonData, palletData, containerData, settings) {
    this.carton = cartonData;
    this.pallet = palletData;
    this.container = containerData;
    this.settings = settings;
    
    // Convert all dimensions to consistent units (cm)
    this.cartonDims = {
      length: cartonData.length,
      width: cartonData.width,
      height: cartonData.height,
      weight: cartonData.weight
    };
    
    this.palletDims = {
      length: palletData.length,
      width: palletData.width,
      height: palletData.height,
      maxWeight: palletData.maxWeight,
      maxHeight: palletData.maxHeight
    };
    
    this.containerDims = {
      length: containerData.length,
      width: containerData.width,
      height: containerData.height,
      maxWeight: containerData.maxWeight
    };
  }

  /**
   * Calculate optimal carton arrangement on a single pallet
   */
  calculatePalletLayout() {
    const { length: cL, width: cW, height: cH } = this.cartonDims;
    const { length: pL, width: pW, maxHeight, maxWeight } = this.palletDims;
    
    // Try different orientations if rotation is enabled
    const orientations = this.settings.enableRotation ? [
      { l: cL, w: cW, h: cH, rotation: 0 },
      { l: cW, w: cL, h: cH, rotation: 90 }
    ] : [{ l: cL, w: cW, h: cH, rotation: 0 }];
    
    let bestLayout = null;
    let maxCartons = 0;
    
    for (const orientation of orientations) {
      const layout = this.calculateSingleOrientation(orientation);
      if (layout.totalCartons > maxCartons) {
        maxCartons = layout.totalCartons;
        bestLayout = layout;
      }
    }
    
    return bestLayout;
  }
  
  /**
   * Calculate layout for a specific carton orientation
   */
  calculateSingleOrientation(orientation) {
    const { l, w, h, rotation } = orientation;
    const { length: pL, width: pW, maxHeight, maxWeight } = this.palletDims;
    
    // Calculate how many cartons fit in each direction
    const cartonsX = Math.floor(pL / l);
    const cartonsY = Math.floor(pW / w);
    const cartonsPerLayer = cartonsX * cartonsY;
    
    // Calculate maximum layers based on height and weight constraints
    const maxLayersByHeight = Math.floor(maxHeight / h);
    const maxLayersByWeight = Math.floor(maxWeight / (cartonsPerLayer * this.cartonDims.weight));
    const maxLayers = Math.min(maxLayersByHeight, maxLayersByWeight);
    
    const totalCartons = cartonsPerLayer * maxLayers;
    
    // Generate carton positions
    const cartonPositions = [];
    for (let layer = 0; layer < maxLayers; layer++) {
      for (let y = 0; y < cartonsY; y++) {
        for (let x = 0; x < cartonsX; x++) {
          cartonPositions.push({
            x: (x + 0.5) * l - pL / 2,
            y: (layer + 0.5) * h,
            z: (y + 0.5) * w - pW / 2,
            layer,
            rotation
          });
        }
      }
    }
    
    return {
      cartonsPerLayer,
      maxLayers,
      totalCartons,
      cartonPositions,
      orientation,
      efficiency: (cartonsPerLayer * l * w) / (pL * pW),
      utilization: totalCartons / (Math.floor(pL / this.cartonDims.length) * Math.floor(pW / this.cartonDims.width) * Math.floor(maxHeight / this.cartonDims.height))
    };
  }
  
  /**
   * Calculate optimal pallet arrangement in container
   */
  calculateContainerLayout(palletLayout) {
    if (!palletLayout) {
      return {
        palletsPerLayer: 0,
        maxPalletLayers: 0,
        totalPallets: 0,
        palletPositions: [],
        containerUtilization: 0,
        weightUtilization: 0
      };
    }

    const { length: pL, width: pW, height: pH } = this.palletDims;
    const { length: cL, width: cW, height: cH, maxWeight } = this.containerDims;
    
    // Calculate pallet stack height (pallet + cartons)
    const stackHeight = pH + (palletLayout.maxLayers * this.cartonDims.height);
    
    // Calculate how many pallets fit in each direction
    const palletsX = Math.floor(cL / pL);
    const palletsY = Math.floor(cW / pW);
    const palletsZ = Math.floor(cH / stackHeight);
    
    const palletsPerLayer = palletsX * palletsY;
    const maxPalletLayers = palletsZ;
    const totalPallets = palletsPerLayer * maxPalletLayers;
    
    // Check weight constraint
    const totalWeight = totalPallets * palletLayout.totalCartons * this.cartonDims.weight;
    const weightLimitedPallets = Math.floor(maxWeight / (palletLayout.totalCartons * this.cartonDims.weight));
    const actualPallets = Math.min(totalPallets, weightLimitedPallets);
    
    // Generate pallet positions
    const palletPositions = [];
    let palletCount = 0;
    
    for (let layer = 0; layer < maxPalletLayers && palletCount < actualPallets; layer++) {
      for (let y = 0; y < palletsY && palletCount < actualPallets; y++) {
        for (let x = 0; x < palletsX && palletCount < actualPallets; x++) {
          palletPositions.push({
            x: (x + 0.5) * pL - cL / 2,
            y: layer * stackHeight + pH / 2,
            z: (y + 0.5) * pW - cW / 2,
            layer,
            index: palletCount
          });
          palletCount++;
        }
      }
    }
    
    return {
      palletsPerLayer,
      maxPalletLayers,
      totalPallets: actualPallets,
      palletPositions,
      containerUtilization: (actualPallets * pL * pW * stackHeight) / (cL * cW * cH),
      weightUtilization: totalWeight / maxWeight
    };
  }
  
  /**
   * Calculate complete 3D layout
   */
  calculateComplete3DLayout() {
    // Calculate pallet layout
    const palletLayout = this.calculatePalletLayout();
    
    if (!palletLayout) {
      return {
        cartonsPerLayer: 0,
        maxLayers: 0,
        cartonsPerPallet: 0,
        cartonPositions: [],
        palletsPerContainer: 0,
        totalPalletsPlaced: 0,
        palletPositions: [],
        totalCartons: 0,
        remainingCartons: this.carton.quantity,
        packingEfficiency: 0,
        spaceUtilization: 0,
        weightUtilization: 0,
        layout3D: {
          palletLayout: null,
          containerLayout: null,
          scale: 0.01,
          cartonDimensions: this.cartonDims,
          palletDimensions: this.palletDims,
          containerDimensions: this.containerDims
        }
      };
    }
    
    // Calculate container layout
    const containerLayout = this.calculateContainerLayout(palletLayout);
    
    // Calculate totals
    const totalCartons = containerLayout.totalPallets * palletLayout.totalCartons;
    const remainingCartons = Math.max(0, this.carton.quantity - totalCartons);
    const packingEfficiency = totalCartons / this.carton.quantity;
    
    return {
      // Pallet level
      cartonsPerLayer: palletLayout.cartonsPerLayer,
      maxLayers: palletLayout.maxLayers,
      cartonsPerPallet: palletLayout.totalCartons,
      cartonPositions: palletLayout.cartonPositions,
      
      // Container level
      palletsPerContainer: containerLayout.palletsPerLayer,
      totalPalletsPlaced: containerLayout.totalPallets,
      palletPositions: containerLayout.palletPositions,
      
      // Summary
      totalCartons,
      remainingCartons,
      packingEfficiency,
      spaceUtilization: containerLayout.containerUtilization,
      weightUtilization: containerLayout.weightUtilization,
      
      // 3D specific data
      layout3D: {
        palletLayout,
        containerLayout,
        scale: 0.01, // Convert cm to meters for 3D display
        cartonDimensions: this.cartonDims,
        palletDimensions: this.palletDims,
        containerDimensions: this.containerDims
      }
    };
  }
}

/**
 * Helper function to create 3D layout from calculator result
 */
export function create3DLayout(cartonData, palletData, containerData, settings) {
  const layout3D = new Layout3D(cartonData, palletData, containerData, settings);
  return layout3D.calculateComplete3DLayout();
}

