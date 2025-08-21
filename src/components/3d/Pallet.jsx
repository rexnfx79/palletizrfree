import React from 'react';
import { Box } from '@react-three/drei';

export function Pallet({ dimensions, position }) {
  const slotWidth = 0.02; // 2cm slots
  const slotSpacing = dimensions.length / 7; // 7 slats per pallet
  
  return (
    <group position={position}>
      {/* Main pallet base */}
      <Box
        args={[dimensions.length, dimensions.height * 0.3, dimensions.width]}
        position={[0, -dimensions.height * 0.35, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#8b4513" 
          roughness={0.8}
          metalness={0.1}
        />
      </Box>
      
      {/* Pallet slats */}
      {Array.from({ length: 7 }, (_, i) => (
        <Box
          key={i}
          args={[slotWidth, dimensions.height * 0.7, dimensions.width]}
          position={[
            (i - 3) * slotSpacing, 
            0, 
            0
          ]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color="#a0522d" 
            roughness={0.9}
            metalness={0.05}
          />
        </Box>
      ))}
      
      {/* Support beams */}
      {Array.from({ length: 3 }, (_, i) => (
        <Box
          key={`beam-${i}`}
          args={[dimensions.length, dimensions.height * 0.4, 0.02]}
          position={[
            0, 
            -dimensions.height * 0.3, 
            (i - 1) * (dimensions.width * 0.4)
          ]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.9}
            metalness={0.05}
          />
        </Box>
      ))}
    </group>
  );
}

