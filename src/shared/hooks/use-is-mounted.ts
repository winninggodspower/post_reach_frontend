"use client"

import * as React from "react"

/**
 * Custom hook that returns a function returning `true` if the component is mounted,
 * and `false` after it has unmounted.
 *
 * Useful for preventing state updates after unmount in asynchronous operations.
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = React.useRef(false)

  React.useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return React.useCallback(() => isMountedRef.current, [])
}
