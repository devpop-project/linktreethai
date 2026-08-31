'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import './ScrollFloat.css'

interface ScrollFloatProps {
  children: React.ReactNode
  scrollContainerRef?: React.RefObject<HTMLElement>
  containerClassName?: string
  textClassName?: string
  animationDuration?: number
  ease?: string
  scrollStart?: string
  scrollEnd?: string
  stagger?: number
}

export default function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 0.8,
  ease = 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  stagger = 0.02
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const splitText = useMemo(() => {
    if (typeof children !== 'string') return children
    return children.split('').map((char, index) => (
      <span
        className={`scroll-float-char ${isVisible ? 'is-visible' : ''}`}
        key={index}
        style={{
          transitionDelay: `${index * stagger}s`,
          transitionDuration: `${animationDuration}s`
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }, [children, isVisible, stagger, animationDuration])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1
      }
    )

    observer.observe(el)
    const timer = setTimeout(() => setIsVisible(true), 80)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  return (
    <h2
      ref={containerRef}
      className={`scroll-float ${containerClassName}`}
      style={{ ['--sf-duration' as any]: `${animationDuration}s` }}
    >
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </h2>
  )
}
