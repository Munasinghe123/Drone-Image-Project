
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center } from '@react-three/drei'

import React, { Suspense, useEffect, useState, useRef } from 'react'

import * as THREE from 'three'

function Drone({ scrollY, targetTop }) {
    const { scene } = useGLTF('/models/drone.glb')
    const ref = useRef()

    const base = useRef(new THREE.Vector3(2.5, -1.5, 0))
    const target = new THREE.Vector3(0, -0.6, 0) // middle of How It Works

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

        if (progress < 1) {
            // FLOATING POSITION
            const floatPos = new THREE.Vector3(
                base.current.x + Math.sin(t * 0.4) * 1,
                base.current.y + Math.sin(t * 0.6) * 2,
                base.current.z + Math.cos(t * 0.4) * 0.4
            )

            // BLEND float → target
            ref.current.position.lerpVectors(
                floatPos,
                target,
                progress
            )

            ref.current.rotation.z = Math.sin(t * 0.2) * 0.03
        } else {
            // STOP
            ref.current.position.copy(target)
            ref.current.rotation.set(0, 0, 0)
        }
    })

    return <primitive ref={ref} object={scene} scale={0.8} />
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

