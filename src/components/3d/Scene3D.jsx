import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

export function Scene3D({ result, cartonData, palletData, containerData }) {
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

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleToggleLayer = (layer, visible) => {
    switch (layer) {
      case 'pallets':
        setShowPallets(visible);
        break;
      case 'cartons':
        setShowCartons(visible);
        break;
      case 'container':
        setShowContainer(visible);
        break;
    }
  };

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
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
            result={result}
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
      
      {/* 3D Controls UI */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-2">View</div>
        <button
          onClick={handleResetCamera}
          className="w-full px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        >
          Reset
        </button>
        
        <div className="text-sm font-medium text-gray-700 mb-2 mt-4">Layers</div>
        <div className="space-y-1">
          <button
            onClick={() => handleToggleLayer('container', !showContainer)}
            className={`w-full px-3 py-1 text-xs rounded ${
              showContainer ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Container
          </button>
          <button
            onClick={() => handleToggleLayer('pallets', !showPallets)}
            className={`w-full px-3 py-1 text-xs rounded ${
              showPallets ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pallets
          </button>
          <button
            onClick={() => handleToggleLayer('cartons', !showCartons)}
            className={`w-full px-3 py-1 text-xs rounded ${
              showCartons ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Cartons
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          • Drag to rotate<br/>
          • Scroll to zoom<br/>
          • Right-click to pan
        </div>
      </div>
    </div>
  );
}

function PalletVisualization({ result, cartonData, palletData, containerData, showPallets, showCartons, showContainer }) {
  const { layout3D } = result;
  
  // Debug logging
  console.log('PalletVisualization received result:', result);
  console.log('layout3D:', layout3D);
  console.log('cartonData:', cartonData);
  console.log('palletData:', palletData);
  console.log('containerData:', containerData);
  
  if (!layout3D || (!layout3D.layout3D && !layout3D.cartonPositions)) {
    console.log('Missing layout3D data:', {
      hasLayout3D: !!layout3D,
      hasNestedLayout3D: !!(layout3D && layout3D.layout3D),
      hasCartonPositions: !!(layout3D && layout3D.cartonPositions),
      layoutKeys: layout3D ? Object.keys(layout3D) : []
    });
    return null;
  }

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

  const containerDims = {
    length: containerData.length * scale,
    width: containerData.width * scale,
    height: containerData.height * scale
  };

  // Get layout data - the actual 3D data is nested in layout3D.layout3D
  const { palletLayout, containerLayout } = layout3D.layout3D || {};
  const { palletPositions } = containerLayout || {};
  const { cartonPositions } = palletLayout || {};
  
  // If we don't have the nested structure, use the flat structure
  const actualCartonPositions = cartonPositions || layout3D.cartonPositions || [];
  const actualPalletPositions = palletPositions || layout3D.palletPositions || [];
  
  console.log('Layout data:', {
    palletPositions: actualPalletPositions?.length || 0,
    cartonPositions: actualCartonPositions?.length || 0,
    totalPallets: containerLayout?.totalPallets || layout3D.totalPalletsPlaced,
    totalCartons: result.summary?.totalCartons || layout3D.totalCartons
  });

  return (
    <group>
      {/* Container outline */}
      {showContainer && (
        <group position={[0, containerDims.height / 2, 0]}>
          {/* Container floor */}
          <mesh position={[0, -containerDims.height / 2, 0]} receiveShadow>
            <boxGeometry args={[containerDims.length, 0.05, containerDims.width]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          
          {/* Container walls (wireframe) */}
          <mesh>
            <boxGeometry args={[containerDims.length, containerDims.height, containerDims.width]} />
            <meshBasicMaterial color="#64748b" wireframe />
          </mesh>
        </group>
      )}
      
      {/* Pallets and cartons */}
      {actualPalletPositions && actualPalletPositions.map((palletPos, palletIndex) => (
        <group key={palletIndex}>
          {/* Pallet */}
          {showPallets && (
            <group position={[palletPos.x * scale, palletPos.y * scale, palletPos.z * scale]}>
              {/* Pallet base */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[palletDims.length, palletDims.height, palletDims.width]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
              
              {/* Pallet slats */}
              {Array.from({ length: 7 }, (_, i) => (
                <mesh 
                  key={i}
                  position={[
                    (i - 3) * (palletDims.length / 6),
                    palletDims.height / 2 + 0.01,
                    0
                  ]}
                  castShadow
                >
                  <boxGeometry args={[0.02, 0.02, palletDims.width]} />
                  <meshStandardMaterial color="#654321" />
                </mesh>
              ))}
            </group>
          )}
          
          {/* Cartons on this pallet */}
          {showCartons && actualCartonPositions && actualCartonPositions.map((cartonPos, cartonIndex) => (
            <mesh
              key={`${palletIndex}-${cartonIndex}`}
              position={[
                (palletPos.x + cartonPos.x) * scale,
                (palletPos.y + palletPos.height + cartonPos.y) * scale,
                (palletPos.z + cartonPos.z) * scale
              ]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[cartonDims.length, cartonDims.height, cartonDims.width]} />
              <meshStandardMaterial 
                color={`hsl(${(palletIndex * 60) % 360}, 70%, 60%)`}
                transparent
                opacity={0.8}
              />
              {/* Carton edges */}
              <mesh>
                <edgesGeometry args={[new THREE.BoxGeometry(cartonDims.length, cartonDims.height, cartonDims.width)]} />
                <lineBasicMaterial color="#374151" />
              </mesh>
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Labels */}
      <Text
        position={[0, containerDims.height + 1, 0]}
        fontSize={0.5}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {`${containerLayout.totalPallets} Pallets • ${result.totalCartons} Cartons`}
      </Text>
    </group>
  );
}

