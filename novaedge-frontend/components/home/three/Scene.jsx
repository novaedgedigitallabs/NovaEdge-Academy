"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, Text, useScroll, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export default function Scene({ progress }) {
    const { camera } = useThree();
    const groupRef = useRef();

    // Define states for camera and objects
    // 0.00–0.20 -> Intro
    // 0.20–0.40 -> Learning
    // 0.40–0.60 -> Mentors
    // 0.60–0.80 -> Community
    // 0.80–1.00 -> CTA

    useFrame((state) => {
        // Camera Position Animation
        if (progress < 0.2) {
            // Intro: Center view
            camera.position.lerp(new THREE.Vector3(0, 0, 5), 0.1);
            camera.lookAt(0, 0, 0);
        } else if (progress < 0.4) {
            // Learning: Shift to show modules
            camera.position.lerp(new THREE.Vector3(-2, 1, 4), 0.1);
        } else if (progress < 0.6) {
            // Mentors: Shift to show mentors
            camera.position.lerp(new THREE.Vector3(2, -1, 4), 0.1);
        } else if (progress < 0.8) {
            // Community: Zoom in/Rotate
            camera.position.lerp(new THREE.Vector3(0, 0, 3), 0.1);
        } else {
            // CTA: Zoom out/Overview
            camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.1);
        }

        // Object Animations
        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, progress * Math.PI * 2, 0.05);
        }
    });

    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />

            <group ref={groupRef}>
                {/* Intro Object */}
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <mesh position={[0, 0, 0]} visible={progress < 0.3}>
                        <torusKnotGeometry args={[0.8, 0.3, 128, 16]} />
                        <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.8} />
                    </mesh>
                </Float>

                {/* Learning Modules (Represented by Cubes) */}
                <group visible={progress >= 0.2 && progress < 0.5}>
                    {[...Array(5)].map((_, i) => (
                        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                            <mesh position={[Math.sin(i) * 2, Math.cos(i) * 2, -2]}>
                                <boxGeometry args={[0.5, 0.5, 0.5]} />
                                <meshStandardMaterial color="#10b981" />
                            </mesh>
                        </Float>
                    ))}
                </group>

                {/* Mentors (Represented by Spheres) */}
                <group visible={progress >= 0.4 && progress < 0.7}>
                    {[...Array(3)].map((_, i) => (
                        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
                            <mesh position={[(i - 1) * 2, 0, -1]}>
                                <sphereGeometry args={[0.6, 32, 32]} />
                                <meshStandardMaterial color="#f59e0b" />
                            </mesh>
                        </Float>
                    ))}
                </group>

                {/* Community (Represented by a Ring of particles or small objects) */}
                <group visible={progress >= 0.6}>
                    {[...Array(20)].map((_, i) => (
                        <mesh key={i} position={[Math.sin(i * 0.3) * 3, Math.cos(i * 0.3) * 3, -3]}>
                            <octahedronGeometry args={[0.2]} />
                            <meshStandardMaterial color="#8b5cf6" />
                        </mesh>
                    ))}
                </group>
            </group>

            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </>
    );
}
