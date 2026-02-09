import { forwardRef, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FeatureOrbit from '../components/FeatureOrbit'

gsap.registerPlugin(ScrollTrigger)

const Features = forwardRef((props, ref) => {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return

    gsap.set(textRef.current, { opacity: 0 })

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 20%',
      end: 'bottom top',
      onEnter: () => gsap.to(textRef.current, { opacity: 1, duration: 0.4 }),
      onLeaveBack: () => gsap.to(textRef.current, { opacity: 0, duration: 0.3 }),
    })

    return () => trigger.kill()
  }, [])

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
        if (ref) ref.current = node
      }}
      className="relative overflow-hidden"
    >

      <div
        ref={textRef}
        className="fixed left-10 md:left-20 top-28 z-20 max-w-sm pointer-events-none"
      >
        <span className="block text-sm uppercase tracking-widest text-purple-500 mb-3">
          Features
        </span>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-6">
          Built for modern <span className='text-purple-700'>inspection </span>
        </h2>

        <div className="w-12 h-[2px] bg-black rounded-full mb-6" />

        <p className="text-slate-600 text-lg leading-relaxed">
          Intelligent solutions for{" "}
          <span className="text-purple-600 font-medium">
            modern infrastructure inspection
          </span>
        </p>
      </div>

      <FeatureOrbit />
    </section>
  )
})

export default Features
