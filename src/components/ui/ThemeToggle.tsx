"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { SunIcon, MoonIcon } from "@/components/ui/icons";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 90 }}
        transition={{ duration: 0.15 }}
      >
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={
            isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
          }
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
