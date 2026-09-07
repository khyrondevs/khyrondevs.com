

interface SceneTransitionProps {
  type?: 'line-drop' | 'grid-fade' | 'signal-cross'
}

export function SceneTransition({ type = 'line-drop' }: SceneTransitionProps) {
  if (type === 'line-drop') {
    return (
      <div className="w-full h-32 relative flex items-center justify-center pointer-events-none -my-16 z-20">
        <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
        <div className="absolute top-1/2 w-2 h-2 bg-accent/40 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      </div>
    )
  }
  
  if (type === 'signal-cross') {
    return (
      <div className="w-full h-[1px] relative pointer-events-none z-20 bg-border/20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent w-1/4 animate-[marquee-right_3s_linear_infinite]" />
      </div>
    )
  }

  return (
    <div className="w-full h-32 relative pointer-events-none -my-16 z-20 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full bg-grid-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    </div>
  )
}
