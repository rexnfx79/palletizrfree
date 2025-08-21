import React from 'react';
import { Box, Edges } from '@react-three/drei';

export function Container({ dimensions, position }) {
  const wallThickness = 0.05; // 5cm wall thickness
  
  return (
    <group position={position}>
      {/* Container floor */}
      <Box
        args={[dimensions.length, wallThickness, dimensions.width]}
        position={[0, -dimensions.height / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#2d3748" 
          roughness={0.7}
          metalness={0.3}
        />
      </Box>
      
      {/* Container walls - Left */}
      <Box
        args={[wallThickness, dimensions.height, dimensions.width]}
        position={[-dimensions.length / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#4a5568" 
          transparent
          opacity={0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </Box>
      
      {/* Container walls - Right */}
      <Box
        args={[wallThickness, dimensions.height, dimensions.width]}
        position={[dimensions.length / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#4a5568" 
          transparent
          opacity={0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </Box>
      
      {/* Container walls - Front */}
      <Box
        args={[dimensions.length, dimensions.height, wallThickness]}
        position={[0, 0, -dimensions.width / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#4a5568" 
          transparent
          opacity={0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </Box>
      
      {/* Container walls - Back */}
      <Box
        args={[dimensions.length, dimensions.height, wallThickness]}
        position={[0, 0, dimensions.width / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#4a5568" 
          transparent
          opacity={0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </Box>
      
      {/* Container outline */}
      <Edges
        args={[dimensions.length, dimensions.height, dimensions.width]}
        color="#1a202c"
        lineWidth={2}
      />
    </group>
  );
}

