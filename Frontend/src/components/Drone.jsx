import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import React, { Suspense, useEffect, useState, useRef } from 'react'
import * as THREE from 'three'

function Drone({ scrollY, targetTop }) {
    const { scene } = useGLTF('/models/drone.glb')
    const ref = useRef()

    // Starting position (RIGHT side)
    const base = useRef(new THREE.Vector3(2.5, -1, 0))

    // End position (LEFT side of features page)
    const target = new THREE.Vector3(-5, -3, 0)

    useFrame((state) => {
        if (!ref.current) return

        const t = state.clock.elapsedTime

        const start = targetTop - window.innerHeight
        const end = targetTop

        const progress = THREE.MathUtils.clamp(
            (scrollY - start) / (end - start),
            0,
            1
        )

        const motion = 1 - progress // Decreases as we scroll

        if (progress < 1) {
            // === FLOATING + FLYING ===

            // Original floating position (with your motion values)
            const floatPos = new THREE.Vector3(
                base.current.x + Math.sin(t * 0.4) * motion, // Float decreases as we fly
                base.current.y + Math.sin(t * 0.6) * motion,
                base.current.z + Math.cos(t * 0.4) * motion
            )

            // Blend from floating position → target (LEFT side)
            ref.current.position.lerpVectors(
                floatPos,
                target,
                progress
            )

            // Banking animation (gets stronger as progress increases)
            ref.current.rotation.z = Math.sin(t * 0.2) * 0.03 * motion + // Original gentle rotation
                Math.sin(progress * Math.PI) * 0.4 * progress // Banking increases with progress

            // Yaw (turn left) during flight
            ref.current.rotation.y = progress * 0.5

        } else {
            // === ARRIVED: Settled on LEFT ===
            ref.current.position.copy(target)

            // Gentle hover when arrived
            ref.current.position.y = target.y + Math.sin(t * 1.5) * 0.05

            ref.current.rotation.set(0, 0.3, 0) // Look toward cards
        }
    })

    //loads the drone 
    return <primitive ref={ref} object={scene} scale={0.9} />
}

export default function DroneScene({ targetRef }) {
    const [scrollY, setScrollY] = useState(0)
    const [targetTop, setTargetTop] = useState(0)

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', onScroll)

        if (targetRef?.current) {
            setTargetTop(targetRef.current.offsetTop)
        }

        return () => window.removeEventListener('scroll', onScroll)
    }, [targetRef])

    return (
        <div className="fixed inset-0 z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 5, 6], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} />

                <Suspense fallback={null}>
                    <Drone
                        scrollY={scrollY}
                        targetTop={targetTop}
                    />
                </Suspense>

                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    )
}