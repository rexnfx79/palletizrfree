import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Edges } from '@react-three/drei';

export function Carton({ dimensions, position, color = '#3b82f6', opacity = 0.8 }) {
  const meshRef = useRef();
  
  // Subtle hover animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[dimensions.length, dimensions.height, dimensions.width]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={opacity}
          roughness={0.3}
          metalness={0.1}
        />
      </Box>
      
      {/* Edges for better definition */}
      <Edges
        geometry={meshRef.current?.geometry}
        color="#1e293b"
        lineWidth={1}
      />
    </group>
  );
}

