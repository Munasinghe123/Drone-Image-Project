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
    description: "Autonomous inspection with real-time imagery.",
    image: aiImg,
  },
  {
    title: "Secure Image Storage",
    description: "Encrypted and indexed inspection data.",
    image: realtimeImg,
  },
  {
    title: "AI-Powered Inspection",
    description: "Automated obstacle avoidance and analysis.",
    image: safetyImg,
  },
  {
    title: "Actionable Insights",
    description: "Instant reports and maintenance alerts.",
    image: reportImg,
  },
]

export default function FeatureOrbitTrue3D() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const currentStep = useRef(0)

  // ---- tuning knobs
  const tilt = -14
  const radius = 260
  const depth = 220
  const scrollFactor = 1.15 // >1 = heavier scroll per card

  useEffect(() => {
    const total = features.length
    const angleStep = (Math.PI * 2) / total

    // ---------------------------
    // Position cards by orbit angle
    // ---------------------------
    const setPositions = (step) => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return

        const angle = i * angleStep - step * angleStep
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius * 0.45
        const z = Math.sin(angle) * depth

        const scale = gsap.utils.mapRange(-depth, depth, 0.65, 1.05, z)
        const opacity = gsap.utils.mapRange(-depth, depth, 0.3, 1, z)
        const blur = gsap.utils.mapRange(-depth, depth, 6, 0, z)

        gsap.to(card, {
          x,
          y,
          z,
          scale,
          opacity,
          filter: `blur(${blur}px)`,
          zIndex: Math.round(scale * 100),
          duration: 0.6,
          ease: "power2.out",
        })
      })
    }

    // initial state
    setPositions(0)

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${window.innerHeight * (total - 1) * scrollFactor}`,
      pin: true,

      onUpdate: (self) => {
        const nextStep = Math.round(self.progress * (total - 1))

        if (nextStep !== currentStep.current) {
          currentStep.current = nextStep
          setPositions(currentStep.current)
        }
      },
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-end overflow-hidden pr-28 bg-purple-50"
    >
      {/* Perspective wrapper */}
      <div
        className="relative w-[720px] h-[720px] "
        style={{
          perspective: "1200px",
          transform: `rotateX(${tilt}deg)`,
        }}
      >
        {features.map((f, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                w-[400px] h-[240px]
                rounded-3xl overflow-hidden
                bg-white/85 backdrop-blur-2xl
                border border-purple-400/30"

            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={f.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover brightness-95"
            />

            <div className="
              absolute inset-0
              bg-gradient-to-t
              from-black/70
              via-black/35
              to-transparent
            " />
            
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-white">
                {f.description}
              </p>
            </div>
          </div>
        ))}


      </div>
    </section>
  )
}
