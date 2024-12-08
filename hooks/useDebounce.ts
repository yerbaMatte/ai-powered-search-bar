import { useState, useEffect, Dispatch, SetStateAction } from "react";

//debounce hook - avoid fetch calls on every keystroke
function useDebounce<T>(
  value: T,
  delay: number
): { debouncedValue: T; setDebouncedValue: Dispatch<SetStateAction<T>> } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debouncedValue, setDebouncedValue };
}

export default useDebounce;
