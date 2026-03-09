import { useEffect, useRef } from 'react'

export function useIntersectionObserver(
  callback: () => void,
  options?: { enabled?: boolean },
) {
  const ref = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!ref.current || options?.enabled === false) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callbackRef.current()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [options?.enabled])

  return ref
}
