"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

const POSITIONS = ["3rd", "2nd", "1st"] as const

// Small celebratory burst as a prize row fades in.
function burst(origin: { x: number; y: number }) {
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 38,
    origin,
    colors: ["#0b6b3a", "#128a4b", "#f2c14e", "#ffffff"],
    scalar: 0.9,
    ticks: 160,
  })
}

// Big finale for the grand prize: balloons + sustained confetti + pop-out.
function grandFinale() {
  const overlay = document.getElementById("celebration")
  overlay?.classList.add("show")

  // Launch a field of balloons.
  const balloons = document.getElementById("balloons")
  if (balloons) {
    const colors = ["#0b6b3a", "#128a4b", "#f2c14e", "#e2554f", "#3f7fd1"]
    for (let i = 0; i < 22; i++) {
      const b = document.createElement("span")
      b.className = "balloon"
      b.style.left = `${Math.random() * 100}%`
      b.style.background = colors[i % colors.length]
      b.style.animationDuration = `${5 + Math.random() * 3.5}s`
      b.style.animationDelay = `${Math.random() * 1.2}s`
      b.style.setProperty("--sway", `${(Math.random() * 40 - 20).toFixed(0)}px`)
      balloons.appendChild(b)
    }
  }

  // Confetti cannons from both sides, sustained.
  const end = Date.now() + 2600
  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: ["#0b6b3a", "#128a4b", "#f2c14e", "#ffffff"],
    })
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: ["#0b6b3a", "#128a4b", "#f2c14e", "#ffffff"],
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()

  // A single big center pop.
  confetti({
    particleCount: 220,
    spread: 120,
    startVelocity: 55,
    origin: { x: 0.5, y: 0.45 },
    colors: ["#0b6b3a", "#128a4b", "#f2c14e", "#ffffff", "#e2554f"],
    scalar: 1.2,
  })
}

export function SpinRunner() {
  useEffect(() => {
    let index = 0
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const wheel = document.getElementById("wheel")
    const title = document.getElementById("spin-title")
    const status = document.getElementById("live-status")
    const badge = document.getElementById("draw-status")
    const rows = Array.from(document.querySelectorAll<HTMLElement>(".prize"))

    const run = async () => {
      if (cancelled) return
      const position = POSITIONS[index]
      const response = await fetch("/api/winner", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `position=${position}`,
      })
      const result = await response.json()
      if (cancelled) return

      const row = rows.find((item) => item.dataset.position === result.prize.position)
      row?.classList.add("won")

      const isGrand = position === "1st"

      // Celebrate this prize as it fades in.
      if (row) {
        const rect = row.getBoundingClientRect()
        const origin = {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        }
        if (!isGrand) burst(origin)
      }

      if (index < POSITIONS.length - 1) {
        index++
        if (title) title.textContent = `Selecting ${POSITIONS[index]} prize.`
        if (status) status.textContent = "Preparing next prize"
        timers.push(setTimeout(run, 1800))
      } else {
        if (title) title.textContent = "All prizes selected."
        if (status) status.textContent = "Draw complete"
        if (badge) badge.textContent = "DRAW COMPLETE"
        wheel?.classList.add("complete")

        // Populate and reveal the grand prize pop-out.
        const nameEl = document.getElementById("celebration-name")
        const amountEl = document.getElementById("celebration-amount")
        if (nameEl) nameEl.textContent = result.prize.name
        if (amountEl) amountEl.textContent = result.prize.amount
        grandFinale()
      }
    }

    timers.push(setTimeout(run, 4600))

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  return null
}
