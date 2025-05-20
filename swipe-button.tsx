"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface SwipeButtonProps {
  onComplete: () => void
}

export default function SwipeButton({ onComplete }: SwipeButtonProps) {
  const [position, setPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const maxPosition = useRef(0)

  useEffect(() => {
    if (containerRef.current) {
      maxPosition.current = containerRef.current.clientWidth - 60 // 60 is the width of the slider button
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !isComplete) {
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (containerRect) {
        const newPosition = Math.max(0, Math.min(e.clientX - containerRect.left - 30, maxPosition.current))
        setPosition(newPosition)

        if (newPosition >= maxPosition.current * 0.95) {
          completeSwipe()
        }
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && !isComplete) {
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (containerRect) {
        const touch = e.touches[0]
        const newPosition = Math.max(0, Math.min(touch.clientX - containerRect.left - 30, maxPosition.current))
        setPosition(newPosition)

        if (newPosition >= maxPosition.current * 0.95) {
          completeSwipe()
        }
      }
    }
  }

  const handleMouseUp = () => {
    if (!isComplete) {
      setIsDragging(false)
      setPosition(0)
    }
  }

  const handleTouchEnd = () => {
    if (!isComplete) {
      setIsDragging(false)
      setPosition(0)
    }
  }

  const completeSwipe = () => {
    setIsComplete(true)
    setPosition(maxPosition.current)
    onComplete()
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isComplete])

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative h-12 bg-gray-200 rounded-full overflow-hidden"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center text-gray-500 pointer-events-none">
          <span className="text-sm font-medium">Swipe to Complete Action 🏦</span>
        </div>
        <div className="absolute top-0 left-0 h-full w-1 bg-black" style={{ width: `${position + 60}px` }}></div>
        <div
          className="absolute top-1 left-1 h-10 w-10 bg-black rounded-full cursor-pointer flex items-center justify-center"
          style={{ transform: `translateX(${position}px)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="h-2 w-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
