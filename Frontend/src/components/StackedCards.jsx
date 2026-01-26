// components/StackedCards.jsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import aiImg from '../Images/detection.png'
import realtimeImg from '../Images/real-time-processing.png'
import safetyImg from '../Images/safety.png'
import reportImg from '../Images/automated-reporting.png'


gsap.registerPlugin(ScrollTrigger)

const features = [
    {
        title: 'AI-Powered Detection',
        description: 'Automatically identify defects with 98% accuracy',
        image: aiImg,
    },
    {
        title: 'Real-Time Processing',
        description: 'Instant analysis during flight using edge computing',
        image: realtimeImg,
    },
    {
        title: 'Safety First',
        description: 'Obstacle avoidance and compliance systems',
        image: safetyImg,
    },
    {
        title: 'Automated Reporting',
        description: 'Generate reports instantly with custom templates',
        image: reportImg,
    },
]

export default function StackedCards() {
    const containerRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const cards = cardsRef.current
        const container = containerRef.current
        if (!cards.length) return

        const triggers = []

        // Initial stack state
        cards.forEach((card, i) => {
            gsap.set(card, {
                x: i === 0 ? 0 : '100%',
                opacity: i === 0 ? 1 : 0,
                scale: 1,
                zIndex: cards.length - i,
            })
        })


        cards.forEach((card, i) => {
            if (i === cards.length - 1) return

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: `top+=${i * window.innerHeight} top`,
                    end: `top+=${(i + 1) * window.innerHeight} top`,
                    scrub: true,
                },
            })

            // Old card stays still (no opacity change)
            // New card slides IN ON TOP
            tl.fromTo(
                cards[i + 1],
                {
                    x: '100%',
                    opacity: 1,
                    zIndex: cards.length, // 🔥 FORCE TOP
                },
                {
                    x: 0,
                    ease: 'power3.out',
                },
                0
            )

            // Hard hide old card AFTER replacement
            tl.set(card, { opacity: 0 })
        })



        return () => triggers.forEach(t => t.kill())
    }, [])

    return (
        <div
            ref={containerRef}
            style={{ height: `${features.length * 100}vh` }}
            className="relative"
        >
            {/* STICKY VIEWPORT */}
            <div className="sticky top-0 h-screen flex items-center justify-end px-10 md:px-20">
                <div className="relative w-full max-w-[600px] h-[500px]">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            ref={(el) => (cardsRef.current[i] = el)}
                            className="absolute inset-0 bg-pur bg-purple-500 rounded-3xl  border border-white/20 p-8 shadow-2xl"
                        >
                            <img
                                src={f.image}
                                alt=""
                                className="w-full h-48 object-cover rounded-xl mb-6"
                            />
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {f.title}
                            </h3>
                            <p className="text-gray-300">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
