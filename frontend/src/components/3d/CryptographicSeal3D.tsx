"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface TokenMeshProps {
  verified?: boolean;
  trustIndex?: number;
}

function TokenMesh({ verified, trustIndex = 96.4 }: TokenMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();

  // Subtle smooth tilt towards cursor
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Target rotation based on pointer position
    const targetRotX = (pointer.y * 0.4);
    const targetRotY = (pointer.x * 0.4);
    
    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      targetRotX,
      4,
      delta
    );
    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      targetRotY + (hovered ? 0.2 : 0),
      4,
      delta
    );

    // Slowly rotate internal core
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.6;
      coreRef.current.rotation.x += delta * 0.3;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.4;
    }
  });

  // Materials
  const titaniumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0F172A"),
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  );

  const cobaltWireframeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: verified ? new THREE.Color("#10B981") : new THREE.Color("#4F46E5"),
        wireframe: true,
        emissive: verified ? new THREE.Color("#059669") : new THREE.Color("#4338CA"),
        emissiveIntensity: 0.6,
      }),
    [verified]
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: verified ? new THREE.Color("#34D399") : new THREE.Color("#818CF8"),
        wireframe: true,
      }),
    [verified]
  );

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer Hexagonal Titanium Proof Tablet */}
      <mesh material={titaniumMaterial}>
        <cylinderGeometry args={[1.8, 1.8, 0.22, 6]} />
      </mesh>

      {/* Outer Wireframe Structural Rim */}
      <mesh material={edgeMaterial} scale={[1.02, 1.02, 1.02]}>
        <cylinderGeometry args={[1.82, 1.82, 0.24, 6]} />
      </mesh>

      {/* Internal Rotating Cryptographic Octahedron Core */}
      <mesh ref={coreRef} material={cobaltWireframeMaterial} scale={0.75}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>

      {/* Orbiting Quantum Proof Ring */}
      <mesh ref={ringRef} scale={1.2}>
        <torusGeometry args={[1.3, 0.02, 8, 32]} />
        <meshBasicMaterial
          color={verified ? "#10B981" : "#4F46E5"}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

export default function CryptographicSeal3D({
  verified = false,
  trustIndex = 96.4,
  className = "w-44 h-44",
}: {
  verified?: boolean;
  trustIndex?: number;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 5, 4]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-3, -3, 2]} intensity={0.9} color="#4F46E5" />
        <TokenMesh verified={verified} trustIndex={trustIndex} />
      </Canvas>
    </div>
  );
}
