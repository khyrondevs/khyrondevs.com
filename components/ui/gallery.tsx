"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryItem } from "@/lib/content/projects"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function Gallery({
  items,
  name,
}: {
  items: GalleryItem[]
  name: string
}) {
  const [index, setIndex] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)
  const count = items.length
  const thumbnailWindow = Math.min(7, count)
  const thumbnailStart = Math.min(
    Math.max(index - Math.floor(thumbnailWindow / 2), 0),
    Math.max(count - thumbnailWindow, 0),
  )
  const visibleItems = useMemo(
    () => items.slice(thumbnailStart, thumbnailStart + thumbnailWindow),
    [items, thumbnailStart, thumbnailWindow],
  )

  const go = useCallback(
    (next: number) => { if (count > 0) setIndex(((next % count) + count) % count) },
    [count],
  )

  useEffect(() => {
    const strip = stripRef.current
    const active = strip?.querySelector<HTMLElement>(`[data-thumb="${index}"]`)
    if (!strip || !active) return
    const left = Math.max(0, Math.min(
      active.offsetLeft + active.offsetWidth / 2 - strip.clientWidth / 2,
      strip.scrollWidth - strip.clientWidth,
    ))
    strip.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    })
  }, [index])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      go(index - 1)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      go(index + 1)
    }
  }

  const current = items[index] ?? items[0]
  if (!current) return null

  return (
    <div
      className="w-full"
      role="group"
      aria-roledescription="carousel"
      aria-label={`${name} screenshots`}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface/50 backdrop-blur-sm">
        <Image
          key={current.src}
          src={current.src}
          alt={`${name} — ${current.label}`}
          fill
          sizes="(max-width: 1023px) 90vw, 850px"
          loading="lazy"
          className="h-full w-full object-contain object-top transition-all duration-500"
        />

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous screenshot"
          disabled={count < 2}
          className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/80 border border-border text-fg transition-transform hover:scale-105 active:scale-95 backdrop-blur-md"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next screenshot"
          disabled={count < 2}
          className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/80 border border-border text-fg transition-transform hover:scale-105 active:scale-95 backdrop-blur-md"
        >
          <ChevronRight size={18} />
        </button>

        {current.theme && (
          <span className="absolute left-4 top-4 rounded-full bg-bg-base/80 border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-muted backdrop-blur-md">
            {current.theme}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full bg-bg-base/80 border border-border px-3 py-1 font-mono text-[11px] text-fg-muted backdrop-blur-md">
          {index + 1} / {count}
        </span>
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-fg-muted font-mono">
        <span className="sr-only">{`Image ${index + 1} of ${count}: `}</span>
        {current.label}
      </p>

      <div ref={stripRef} className="relative mt-4 flex gap-3 overflow-x-auto overscroll-x-contain py-2">
        {visibleItems.map((it, offset) => {
          const i = thumbnailStart + offset
          return (
            <button
              key={i}
              data-thumb={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to ${it.label}`}
              aria-current={i === index}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all duration-300",
                i === index ? "border-accent shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-border opacity-50 hover:opacity-100 hover:border-border-strong",
              )}
            >
              <Image src={it.src} alt="" fill loading="lazy" sizes="96px" className="object-cover object-top" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
