import { useEffect, useRef } from 'react'

export function useIntersectionObserver(
  callback: () => void,
  options?: { enabled?: boolean },
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || options?.enabled === false) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [callback, options?.enabled])

  return ref
}
