"use client";

import { Button } from "@/components/ui/Button/button";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const LoadingSpinner = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

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
