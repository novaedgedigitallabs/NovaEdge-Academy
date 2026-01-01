"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Scene from "./three/Scene";
import Overlay from "./three/Overlay";

gsap.registerPlugin(ScrollTrigger);

export default function ThreeLandingPage() {
    const [progress, setProgress] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: (self) => {
                    setProgress(self.progress);
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative h-[500vh] bg-background">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <Canvas
                    shadows
                    camera={{ position: [0, 0, 5], fov: 30 }}
                    gl={{ antialias: true, alpha: true }}
                    className="absolute inset-0 z-0"
                >
                    <Suspense fallback={null}>
                        <Scene progress={progress} />
                    </Suspense>
                </Canvas>

                <Overlay progress={progress} />
            </div>
        </div>
    );
}
