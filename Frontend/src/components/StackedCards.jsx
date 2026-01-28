import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import aiImg from "../Images/ai.png"
import realtimeImg from "../Images/real-time.png"
import safetyImg from "../Images/safety.png"
import reportImg from "../Images/reporting.png"

gsap.registerPlugin(ScrollTrigger)

const features = [
    {
        title: "Aerial Data Capture",
        description: "Drones autonomously inspect power lines and assets, capturing high-resolution imagery in real time.",
        image: aiImg,
    },
    {
        title: "Secure Image Storage",
        description: "Captured images are securely stored and indexed in a centralized system for processing.",
        image: realtimeImg,
    },
    {
        title: "AI-Powered Inspection",
        description: "Obstacle avoidance and compliance systems",
        image: safetyImg,
    },
    {
        title: "Actionable Insights",
        description: "Generate reports, alerts, and maintenance recommendations automatically.",
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
                opacity: i === 0 ? 1 : 0, // hide unloaded cards
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

        const START_OFFSET = 1

        for (let i = 1; i < totalCards; i++) {
            const tilt = ((i - 1) % 2 === 0 ? 1 : -1) * 4

            tl.to(
                cards[i],
                {
                    opacity: 1,
                    duration: 0.01,
                },
                i - 1 + START_OFFSET
            )

            tl.to(
                cards[i],
                {
                    y: i * STACK_OFFSET,
                    ease: "none",
                    duration: 1,
                },
                i - 1 + START_OFFSET
            )

            tl.to(
                cards[i - 1],
                {
                    rotation: tilt,
                    transformOrigin: "center bottom",
                    duration: 0.4,
                    ease: "power2.out",
                },
                i - 1 + START_OFFSET
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
                            ref={(el) => (cardsRef.current[i] = el)}
                            className="
                                card absolute inset-0 rounded-3xl overflow-hidden
                                bg-white/10 backdrop-blur-2xl
                                border border-purple-400/20
                               
                            "
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-[-1px] rounded-3xl 
                                    bg-[linear-gradient(120deg,transparent,rgba(168,85,247,0.6),transparent)]
                                    opacity-70" />
                            </div>

                            <img
                                src={f.image}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover scale-110 
                                    brightness-90 contrast-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />

                            <div className="relative z-10 p-8 flex flex-col justify-end h-full">
                                <h3 className="text-3xl font-semibold text-white tracking-tight">
                                    {f.title}
                                </h3>
                                <p className="mt-2 text-white/70 text-sm max-w-sm">
                                    {f.description}
                                </p>
                            </div>

                        </div>

                    ))}
                </div>
            </div>
        </section>
    )
}
