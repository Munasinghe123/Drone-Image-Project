import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import aiImg from "../Images/detection.png"
import realtimeImg from "../Images/real-time-processing.png"
import safetyImg from "../Images/safety.png"
import reportImg from "../Images/automated-reporting.png"

gsap.registerPlugin(ScrollTrigger)

const features = [
    {
        title: "AI-Powered Detection",
        description: "Automatically identify defects with 98% accuracy",
        image: aiImg,
    },
    {
        title: "Real-Time Processing",
        description: "Instant analysis during flight using edge computing",
        image: realtimeImg,
    },
    {
        title: "Safety First",
        description: "Obstacle avoidance and compliance systems",
        image: safetyImg,
    },
    {
        title: "Automated Reporting",
        description: "Generate reports instantly with custom templates",
        image: reportImg,
    },
]

export default function StackedCards() {
    const containerRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const cards = cardsRef.current
        const totalCards = cards.length

        if (!totalCards) return

        const STACK_OFFSET = 36

        // --------------------------------
        // Initial state
        // --------------------------------
        cards.forEach((card, i) => {
            gsap.set(card, {
                y: i === 0 ? 0 : "100%",
                opacity: i === 0 ? 1 : 0, // 👈 hide unloaded cards
                zIndex: i + 1,
            })
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${window.innerHeight * (totalCards - 1)}`,
                scrub: true,
                pin: true,
                pinSpacing: false,
            },
        })

        for (let i = 1; i < totalCards; i++) {
            const tilt = ((i - 1) % 2 === 0 ? 1 : -1) * 4
            // Reveal the card ONLY when its animation starts
            tl.to(
                cards[i],
                {
                    opacity: 1,
                    duration: 0.01, // instant reveal
                },
                i - 1
            )

            // Move card into stack
            tl.to(
                cards[i],
                {
                    y: i * STACK_OFFSET,
                    ease: "none",
                    duration: 1,
                },
                i - 1
            )


            tl.to(
                cards[i - 1],
                {
                    rotation: tilt,
                    transformOrigin: "center bottom",
                    duration: 0.4,
                    ease: "power2.out",
                },
                i - 1
            )

        }

        return () => {
            tl.kill()
            ScrollTrigger.getAll().forEach((t) => t.kill())
        }
    }, [])

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden"
            style={{ height: `${(features.length - 1) * 100}vh` }}
        >
            <div className="h-screen flex items-center justify-end px-10 md:px-20">
                <div className="relative w-full max-w-[600px] h-[500px]">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            ref={(el) => (cardsRef.current[i] = el)}
                            className="absolute inset-0 rounded-3xl bg-purple-500 border border-white/20 p-8 shadow-2xl"
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
        </section>
    )
}
