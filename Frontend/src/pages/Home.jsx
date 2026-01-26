import React, { useRef } from 'react'
import LandingPage from './LandingPage'
import DroneScene from '../components/Drone'
import Features from './Features'

function Home() {
    const howItWorksRef = useRef(null)

    return (
        <div>
            <DroneScene targetRef={howItWorksRef} />
            <LandingPage />
            <Features ref={howItWorksRef} />
        </div>
    )
}

export default Home
