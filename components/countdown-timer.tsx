"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  expiryTime: number // timestamp in milliseconds
}

export function CountdownTimer({ expiryTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number
    seconds: number
  }>({ minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = expiryTime - Date.now()

      if (difference <= 0) {
        return { minutes: 0, seconds: 0 }
      }

      return {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryTime])

  return (
    <div className="font-mono text-xl font-bold">
      {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
    </div>
  )
}
