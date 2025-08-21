import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

export function SimpleScene3D({ result, cartonData, palletData, containerData }) {
  const controlsRef = useRef();
  const [showPallets, setShowPallets] = useState(true);
  const [showCartons, setShowCartons] = useState(true);
  const [showContainer, setShowContainer] = useState(true);

  if (!result || !result.layout3D) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Run calculation to see 3D visualization</p>
        </div>
      </div>
    );
  }

  const { layout3D } = result;
  
  // Debug logging
  console.log('SimpleScene3D - layout3D:', layout3D);
  console.log('Carton positions:', layout3D.cartonPositions?.length || 0);
  
  // Log first few carton positions to debug
  if (layout3D.cartonPositions) {
    console.log('First 8 carton positions:', layout3D.cartonPositions.slice(0, 8));
    console.log('Sample carton position object:', layout3D.cartonPositions[0]);
  }

  if (!layout3D.cartonPositions || layout3D.cartonPositions.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No cartons to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{ position: [4, 3, 4], fov: 50 }}
        shadows
        style={{ background: '#f8fafc' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Environment */}
          <Environment preset="warehouse" />
          
          {/* Grid */}
          <Grid 
            position={[0, 0, 0]}
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#94a3b8"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#64748b"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />
          
          {/* 3D Models */}
          <PalletVisualization 
            layout3D={layout3D}
            cartonData={cartonData}
            palletData={palletData}
            containerData={containerData}
            showPallets={showPallets}
            showCartons={showCartons}
            showContainer={showContainer}
          />
          
          {/* Controls */}
          <OrbitControls 
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
      
      {/* Layer Controls */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showContainer}
              onChange={(e) => setShowContainer(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Container</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPallets}
              onChange={(e) => setShowPallets(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Pallet</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showCartons}
              onChange={(e) => setShowCartons(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Cartons</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function PalletVisualization({ layout3D, cartonData, palletData, containerData, showPallets, showCartons, showContainer }) {
  // Convert dimensions from cm to meters for better 3D scale
  const scale = 0.01;
  
  const cartonDims = {
    length: cartonData.length * scale,
    width: cartonData.width * scale,
    height: cartonData.height * scale
  };
  
  const palletDims = {
    length: palletData.length * scale,
    width: palletData.width * scale,
    height: palletData.height * scale
  };

  // Keep raw cm values for correct positional math (then convert once to meters)
  const rawCartonDims = {
    length: cartonData.length,
    width: cartonData.width,
    height: cartonData.height
  };

  const rawPalletDims = {
    length: palletData.length,
    width: palletData.width,
    height: palletData.height
  };

  const containerDims = {
    length: containerData.length * scale,
    width: containerData.width * scale,
    height: containerData.height * scale
  };

  const cartonPositions = layout3D.cartonPositions || [];
  const palletPositions = layout3D.palletPositions || [{ x: 0, y: rawPalletDims.height / 2, z: 0 }];
  
  console.log('Rendering', cartonPositions.length, 'cartons');

  // Determine grid span to center the layout on the pallet
  const firstPos = cartonPositions[0] || {};
  const layoutIsRotated = firstPos.rotation === 'WLH';
  const maxGridX = cartonPositions.reduce((m, p) => Math.max(m, p.gridX ?? 0), 0);
  const maxGridY = cartonPositions.reduce((m, p) => Math.max(m, p.gridY ?? 0), 0);
  const cartonsXCount = maxGridX + 1;
  const cartonsYCount = maxGridY + 1;

  const spanXcm = (layoutIsRotated ? rawCartonDims.width : rawCartonDims.length) * cartonsXCount;
  const spanZcm = (layoutIsRotated ? rawCartonDims.length : rawCartonDims.width) * cartonsYCount;
  const centerOffsetXcm = Math.max(0, (rawPalletDims.length - spanXcm) / 2);
  const centerOffsetZcm = Math.max(0, (rawPalletDims.width - spanZcm) / 2);

  return (
    <group>
      {/* Container outline */}
      {showContainer && (
        <group position={[0, containerDims.height / 2, 0]}>
          <mesh>
            <boxGeometry args={[containerDims.length, containerDims.height, containerDims.width]} />
            <meshBasicMaterial color="#e2e8f0" wireframe />
          </mesh>
          
          {/* Container floor */}
          <mesh 
            position={[0, -containerDims.height / 2, 0]}
            receiveShadow
          >
            <boxGeometry args={[containerDims.length, 0.01, containerDims.width]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>
      )}
      
      {/* Pallet bases (multiple) */}
      {showPallets && palletPositions.map((p, i) => (
        <mesh 
          key={`pallet-${i}`}
          position={[p.x * scale, palletDims.height / 2, p.z * scale]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[palletDims.length, palletDims.height, palletDims.width]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      ))}
      
      {/* Cartons replicated on each pallet */}
      {showCartons && palletPositions.map((palletPos, palletIdx) => (
        <group key={`carton-group-${palletIdx}`}>
      {cartonPositions.map((cartonPos, cartonIndex) => {
        // Handle rotation based on string format (like working code)
        const isRotated = cartonPos.rotation === 'WLH';

        // Geometry dimensions in meters
        const boxArgs = isRotated 
          ? [cartonDims.width, cartonDims.height, cartonDims.length]  // WLH: width, height, length
          : [cartonDims.length, cartonDims.height, cartonDims.width]; // LWH: length, height, width

        // Compute positions in cm relative to pallet center, then convert once to meters
        const halfLengthCm = isRotated ? (rawCartonDims.width / 2) : (rawCartonDims.length / 2);
        const halfWidthCm = isRotated ? (rawCartonDims.length / 2) : (rawCartonDims.width / 2);

        const position = [
          (palletPos.x + (-rawPalletDims.length / 2 + centerOffsetXcm + cartonPos.x + halfLengthCm)) * scale,
          (rawPalletDims.height + cartonPos.z + rawCartonDims.height / 2) * scale,
          (palletPos.z + (-rawPalletDims.width / 2 + centerOffsetZcm + cartonPos.y + halfWidthCm)) * scale
        ];

        // Log all positions for debugging
        if (cartonIndex < 16) {
          console.log(`Carton ${cartonIndex} layer ${cartonPos.layer} [${cartonPos.gridX},${cartonPos.gridY}]:`, {
            original: { x: cartonPos.x, y: cartonPos.y, z: cartonPos.z },
            worldMeters: position,
            rotation: cartonPos.rotation,
            fullObject: cartonPos
          });
        }

        return (
          <mesh
            key={`carton-${palletIdx}-${cartonIndex}`}
            position={position}
            rotation={[0, 0, 0]} // No rotation needed - geometry dimensions are already correct
            castShadow
            receiveShadow
          >
            <boxGeometry args={boxArgs} />
            <meshStandardMaterial 
              color={`hsl(${(cartonPos.gridX ?? 0) * 90}, 70%, 55%)`} // color by column to verify spread
              transparent
              opacity={0.85}
            />
            {/* Carton edges */}
            <mesh>
              <edgesGeometry args={[new THREE.BoxGeometry(...boxArgs)]} />
              <lineBasicMaterial color="#374151" />
            </mesh>
          </mesh>
        );
      })}
        </group>
      ))}
      
      {/* Labels */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.5}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        Pallet Loading Visualization ({cartonPositions.length} cartons)
      </Text>
    </group>
  );
}
