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
      maxWeight: palletData.maxStackWeight || palletData.maxWeight || 1000,
      maxHeight: palletData.maxStackHeight || palletData.maxHeight || 200
    };
    
    this.containerDims = {
      length: containerData.length,
      width: containerData.width,
      height: containerData.height,
      maxWeight: containerData.weightCapacity || containerData.maxWeight || 26000
    };
  }

  /**
   * Calculate optimal carton arrangement on a single pallet
   */
  calculatePalletLayout() {
    const { length: cL, width: cW, height: cH } = this.cartonDims;
    const { length: pL, width: pW, maxHeight, maxWeight } = this.palletDims;
    
    console.log('Calculating pallet layout with:', {
      carton: { cL, cW, cH },
      pallet: { pL, pW, maxHeight, maxWeight },
      settings: this.settings
    });
    
    // Try different orientations if rotation is enabled
    const orientations = (this.settings && this.settings.enableRotation) ? [
      { l: cL, w: cW, h: cH, rotation: 0 },
      { l: cW, w: cL, h: cH, rotation: 90 }
    ] : [{ l: cL, w: cW, h: cH, rotation: 0 }];
    
    let bestLayout = null;
    let bestScore = 0;
    
    for (const orientation of orientations) {
      const layout = this.calculateSingleOrientation(orientation);
      console.log('Orientation result:', orientation, 'layout:', layout);
      
      if (layout && layout.totalCartons > 0) {
        // Score based on carton count, efficiency, utilization, and rotation preference
        let score = layout.totalCartons + (layout.efficiency * 100) + (layout.utilization * 100);
        
        // Prioritize rotated configurations (better space utilization)
        if (orientation.rotation === 90) {
          score += 50; // Bonus for rotated configuration
        }
        
        console.log(`Orientation ${orientation.rotation}° score:`, score);
        
        if (score > bestScore) {
          bestScore = score;
          bestLayout = layout;
        }
      }
    }

    // Evaluate mixed-row layout for potential higher per-layer counts
    const mixed = this.calculateMixedRowLayout();
    if (mixed) {
      const mixedScore = mixed.totalCartons + (mixed.efficiency * 100) + (mixed.utilization * 100) + 75;
      console.log('Mixed-row layout result:', mixed, 'score:', mixedScore);
      if (mixedScore > bestScore) {
        bestScore = mixedScore;
        bestLayout = mixed;
      }
    }
    
    console.log('Best pallet layout:', bestLayout);
    console.log('Selected orientation:', bestLayout?.orientation);
    console.log('Selected rotation:', bestLayout?.cartonPositions?.[0]?.rotation);
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
    console.log(`Generating positions: ${cartonsX} × ${cartonsY} × ${maxLayers} = ${totalCartons} cartons`);
    console.log(`Carton dims: ${l} × ${w} × ${h}, Pallet dims: ${pL} × ${pW}`);
    
    for (let layer = 0; layer < maxLayers; layer++) {
      for (let y = 0; y < cartonsY; y++) {
        for (let x = 0; x < cartonsX; x++) {
          const position = {
            x: x * l,                           // Position from left edge
            y: y * w,                           // Position from front edge  
            z: layer * h,                       // Stack layers vertically
            layer,
            rotation: rotation === 90 ? 'WLH' : 'LWH',  // Convert to string format
            gridX: x,
            gridY: y
          };
          cartonPositions.push(position);
          
          if (layer === 0) {
            console.log(`Carton [${x},${y}] position:`, position);
          }
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
   * Mixed-row layout: combine normal and rotated rows across pallet width
   * to maximize cartons per layer when rotation is allowed.
   */
  calculateMixedRowLayout() {
    if (!this.settings || !this.settings.enableRotation) return null;

    const { length: cL, width: cW, height: cH } = this.cartonDims;
    const { length: pL, width: pW, maxHeight, maxWeight } = this.palletDims;

    // Per-row capacities and row widths for each orientation
    const countRow0 = Math.floor(pL / cL); // using LWH
    const rowWidth0 = cW;
    const countRow90 = Math.floor(pL / cW); // using WLH
    const rowWidth90 = cL;

    if (countRow0 === 0 && countRow90 === 0) return null;

    // Search best combination of rows that fits width
    let best = { a: 0, b: 0, perLayer: 0 };
    const maxRows90 = Math.floor(pW / rowWidth90);
    for (let b = 0; b <= maxRows90; b++) {
      const remainingWidth = pW - b * rowWidth90;
      const a = Math.floor(remainingWidth / rowWidth0);
      const perLayer = a * countRow0 + b * countRow90;
      if (perLayer > best.perLayer) {
        best = { a, b, perLayer };
      }
    }

    const cartonsPerLayer = best.perLayer;
    if (cartonsPerLayer <= 0) return null;

    // Layers limited by height and weight
    const maxLayersByHeight = Math.floor(maxHeight / cH);
    const weightPerLayer = cartonsPerLayer * this.cartonDims.weight;
    const maxLayersByWeight = Math.floor(maxWeight / Math.max(1, weightPerLayer));
    const maxLayers = Math.min(maxLayersByHeight, maxLayersByWeight);

    const totalCartons = cartonsPerLayer * maxLayers;

    // Generate positions row-by-row from back (y=0) to front
    const cartonPositions = [];
    for (let layer = 0; layer < maxLayers; layer++) {
      let yOffset = 0;
      // First add rotated rows (b) of width cL
      for (let r = 0; r < best.b; r++) {
        for (let x = 0; x < countRow90; x++) {
          cartonPositions.push({
            x: x * cW,
            y: yOffset,
            z: layer * cH,
            layer,
            rotation: 'WLH',
            gridX: x,
            gridY: r
          });
        }
        yOffset += rowWidth90;
      }
      // Then normal rows (a) of width cW
      for (let r = 0; r < best.a; r++) {
        for (let x = 0; x < countRow0; x++) {
          cartonPositions.push({
            x: x * cL,
            y: yOffset,
            z: layer * cH,
            layer,
            rotation: 'LWH',
            gridX: x,
            gridY: best.b + r
          });
        }
        yOffset += rowWidth0;
      }
    }

    return {
      cartonsPerLayer,
      maxLayers,
      totalCartons,
      cartonPositions,
      orientation: { rotation: 'mixed', rows: { normal: best.a, rotated: best.b } },
      efficiency: (cartonsPerLayer * cL * cW) / (pL * pW),
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
      // Fill across container width first (back to front), then advance along length
      for (let x = 0; x < palletsX && palletCount < actualPallets; x++) {
        for (let y = 0; y < palletsY && palletCount < actualPallets; y++) {
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
    
    // Determine pallets used based on requested quantity and capacity
    const palletsPerPallet = palletLayout.totalCartons;
    const palletsNeeded = Math.ceil(this.carton.quantity / palletsPerPallet);
    const palletsAvailable = containerLayout.totalPallets;
    const palletsUsed = Math.min(palletsNeeded, palletsAvailable);
    
    // Calculate totals actually placed (respect quantity)
    const totalCartons = Math.min(this.carton.quantity, palletsUsed * palletsPerPallet);
    const remainingCartons = Math.max(0, this.carton.quantity - totalCartons);
    const packingEfficiency = this.carton.quantity > 0 ? (totalCartons / this.carton.quantity) : 0;
    
    return {
      // Pallet level
      cartonsPerLayer: palletLayout.cartonsPerLayer,
      maxLayers: palletLayout.maxLayers,
      cartonsPerPallet: palletLayout.totalCartons,
      cartonPositions: palletLayout.cartonPositions,
      
      // Container level
      palletsPerContainer: containerLayout.palletsPerLayer,
      totalPalletsPlaced: palletsUsed,
      palletPositions: containerLayout.palletPositions.slice(0, palletsUsed),
      
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
  console.log('Creating 3D layout with:', { cartonData, palletData, containerData, settings });
  const layout3D = new Layout3D(cartonData, palletData, containerData, settings);
  const result = layout3D.calculateComplete3DLayout();
  console.log('3D layout result:', result);
  return result;
}

