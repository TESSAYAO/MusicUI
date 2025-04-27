"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface CustomScrollbarProps {
  containerRef: React.RefObject<HTMLDivElement>
  trackClassName?: string
  thumbClassName?: string
}

export function CustomScrollbar({ containerRef, trackClassName = "", thumbClassName = "" }: CustomScrollbarProps) {
  const thumbRef = useRef<HTMLDivElement>(null)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startScrollTop, setStartScrollTop] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateThumbPosition = () => {
      const { scrollHeight, clientHeight, scrollTop } = container
      const scrollRatio = clientHeight / scrollHeight
      const newThumbHeight = Math.max(scrollRatio * clientHeight, 30)
      const newThumbTop = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - newThumbHeight)

      setThumbHeight(newThumbHeight)
      setThumbTop(newThumbTop)
    }

    updateThumbPosition()
    container.addEventListener("scroll", updateThumbPosition)

    const resizeObserver = new ResizeObserver(updateThumbPosition)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener("scroll", updateThumbPosition)
      resizeObserver.disconnect()
    }
  }, [containerRef])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !thumbRef.current) return

      const { scrollHeight, clientHeight } = containerRef.current
      const deltaY = e.clientY - startY
      const deltaRatio = deltaY / (clientHeight - thumbHeight)
      const newScrollTop = startScrollTop + deltaRatio * (scrollHeight - clientHeight)

      containerRef.current.scrollTop = newScrollTop
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startY, startScrollTop, thumbHeight, containerRef])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    setIsDragging(true)
    setStartY(e.clientY)
    setStartScrollTop(containerRef.current.scrollTop)
    e.preventDefault()
  }

  return (
    <div className={`absolute top-0 right-0 w-2 h-full ${trackClassName}`}>
      <div
        ref={thumbRef}
        className={`absolute w-2 rounded-full ${thumbClassName}`}
        style={{
          height: `${thumbHeight}px`,
          top: `${thumbTop}px`,
          backgroundColor: "rgba(106, 202, 234, 0.55)",
          backdropFilter: "blur(2.24px)",
          WebkitBackdropFilter: "blur(2.24px)",
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}
