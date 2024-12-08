import React, { useEffect, useState } from "react";
import { debounceTime } from "@/lib/constants";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  debouncedValue: string;
  suggestions: string[];
  selectedIndex: number;
  inputValue: string;
}

let interval: NodeJS.Timeout | undefined = undefined;

const ProgressBar: React.FC<ProgressBarProps> = ({
  debouncedValue,
  suggestions,
  selectedIndex,
  inputValue,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (interval) {
      clearInterval(interval);
    }

    if (suggestions.length > 0) return;

    if (inputValue.trim() === "") {
      setProgress(100);
    } else if (debouncedValue !== inputValue) {
      setProgress(100);

      const ms = debounceTime / 100;

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, ms);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [inputValue, debouncedValue, suggestions, selectedIndex]);

  return (
    <>
      {inputValue && suggestions.length === 0 && (
        <div
          className={styles.progress_container}
          role="progress-bar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={styles.progress_bar}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
};

export default ProgressBar;
