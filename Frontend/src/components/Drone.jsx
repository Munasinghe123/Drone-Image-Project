import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import React, { Suspense, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Drone({ targetRef }) {
    const { scene } = useGLTF('/models/drone.glb')
    const ref = useRef()

    const base = useRef(new THREE.Vector3(2.5, -1, 0))   // right side
    const target = new THREE.Vector3(-5, -3, 0)          // left bottom

    // GSAP-managed scroll progress (0 → 1)
    const progressRef = useRef(0)

    //  ScrollTrigger
    useLayoutEffect(() => {
        if (!targetRef?.current) return

        ScrollTrigger.create({
            trigger: targetRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            onUpdate: (self) => {
                progressRef.current = self.progress
            },
        })
    }, [targetRef])

    useFrame((state) => {
        if (!ref.current) return

        const t = state.clock.elapsedTime
        const progress = progressRef.current
        const motion = 1 - progress

        if (progress < 1) {
            // === FLOATING ===

            const floatPos = new THREE.Vector3(
                base.current.x + Math.sin(t * 0.4) * 0.08 * motion,
                base.current.y + Math.sin(t * 0.6) * motion,
                base.current.z + Math.cos(t * 0.4) * motion
            )

            //  path
            ref.current.position.lerpVectors(floatPos, target, progress)

            //  banking logic
            ref.current.rotation.z =
                Math.sin(t * 0.2) * 0.03 * motion +
                Math.sin(progress * Math.PI) * 0.4 * progress

            ref.current.rotation.y = progress * 0.5
        } else {
            // === ARRIVED ===
            ref.current.position.copy(target)

            // gentle hover after arrival
            ref.current.position.y =
                target.y + Math.sin(t * 1.5) * 0.05

        }
    })

    return <primitive ref={ref} object={scene} scale={0.9} />
}

export default function DroneScene({ targetRef }) {
    return (
        <div className="fixed inset-0 z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 5, 6], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} />

                <Suspense fallback={null}>
                    <Drone targetRef={targetRef} />
                </Suspense>

                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    )
}
