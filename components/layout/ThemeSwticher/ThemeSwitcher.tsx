"use client";

import { Button } from "@/components/ui/Button/button";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import LoadingSpinner from "@/components/ui/LoadingSpinner/LoadingSpinner";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const changeTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // avoid layout shift
  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-8 w-28">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Button onClick={() => setTheme(changeTheme)} className="h-8 w-28">
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </Button>
    </div>
  );
};
export default ThemeSwitcher;
