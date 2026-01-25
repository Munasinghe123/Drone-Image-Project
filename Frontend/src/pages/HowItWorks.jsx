import React, { forwardRef } from 'react'

const HowItWorks = forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
            className="h-screen w-full flex items-center justify-center"
        >
            <h1 className="text-5xl font-bold">How It Works</h1>
        </div>
    )
})

export default HowItWorks
