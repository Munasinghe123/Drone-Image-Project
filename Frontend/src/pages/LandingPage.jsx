import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Center } from '@react-three/drei'
import mapbg from '../Images/map-bg.png';


function Drone() {
    const { scene } = useGLTF('/models/drone.glb')
    return (
        <Center>
            <primitive object={scene} scale={1} />
        </Center>
    )
}

function LandingPage() {
    return (
        <div className='relative h-screen overflow-hidden w-full items-center justify-center flex'>

            <img
                src={mapbg}
                className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-80"
            />
            
            <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none z-0"></div>

            

            <div className='grid grid-cols-2 z-10 p-4 w-full h-full '>

                {/* col 1 */}
                <div className="flex flex-col justify-center gap-10 px-16">

                    <h1 className="text-6xl font-extrabold leading-tight">
                        From Aerial Images
                        <br />
                        <span className="text-purple-700">to Actionable Insights</span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-xl">
                        Drone-based image capture and intelligent data analysis to enable
                        safer, faster, and more accurate powerline inspections.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <button className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-800 transition">
                            Get Started
                        </button>

                        <button className="border border-purple-700 text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* col 2 */}
                <div className="relative flex items-center justify-center">

                    <Canvas shadows camera={{ position: [0, 5, 6], fov: 50 }} className='w-full h-full z-10 items-center'>
                        {/* Lighting */}
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <directionalLight position={[-5, 5, -5]} intensity={0.5} />

                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <shadowMaterial opacity={0.25} />
                        </mesh>

                        {/* Model */}
                        <Suspense fallback={null}>
                            <Drone />
                        </Suspense>

                        {/* Controls */}
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            autoRotate

                        />
                    </Canvas>
                </div>
            </div>
        </div>
    )
}

export default LandingPage