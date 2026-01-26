import { forwardRef, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StackedCards from '../components/StackedCards'

gsap.registerPlugin(ScrollTrigger)

const Features = forwardRef((props, ref) => {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return

    gsap.set(textRef.current, { opacity: 0 })

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 50%',      
      end: 'bottom top',
      onEnter: () => gsap.to(textRef.current, { opacity: 1, duration: 0.4 }),
      onLeaveBack: () => gsap.to(textRef.current, { opacity: 0, duration: 0.3 }),
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
        if (ref) ref.current = node
      }}
      className="relative min-h-screen bg-purple-50"
    >
      <div
        ref={textRef}
        className="fixed left-10 md:left-20 top-1/2 -translate-y-1/2 z-20 max-w-md pointer-events-none"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Features
        </h2>
        <p className="text-purple-700 text-base md:text-lg">
          Intelligent solutions for modern infrastructure inspection
        </p>
      </div>

      <StackedCards />
    </section>
  )
})

export default Features
