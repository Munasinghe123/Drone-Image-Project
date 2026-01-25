import React, { useRef } from 'react'
import LandingPage from './LandingPage'
import DroneScene from '../components/Drone'
import HowItWorks from './HowItWorks'

function Home() {
    const howItWorksRef = useRef(null)

    return (
        <div>
            <DroneScene targetRef={howItWorksRef} />
            <LandingPage />
            <HowItWorks ref={howItWorksRef} />
        </div>
    )
}

export default Home
