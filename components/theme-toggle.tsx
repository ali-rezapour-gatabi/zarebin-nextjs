'use client'

import { useEffect } from "react"
import { useChatStore } from "@/store/chat"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const theme = useChatStore((state) => state.theme)
  const toggleTheme = useChatStore((state) => state.toggleTheme)

  const isDark = theme === "dark"

  useEffect(() => {
    if (typeof document === "undefined") return

    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="size-7 text-amber-400" />
      ) : (
        <Moon className="size-7 text-sky-500" />
      )}
    </Button>
  )
}
