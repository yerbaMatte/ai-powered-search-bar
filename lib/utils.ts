import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const suggestionsData = [
  "apple",
  "banana",
  "blueberry",
  "cherry",
  "grape",
  "mango",
  "orange",
  "pineapple",
  "strawberry",
  "watermelon",
];

export async function fetchSuggestions(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        suggestionsData.filter((item) =>
          item.toLowerCase().startsWith(query.toLowerCase())
        )
      );
    }, 200);
  });
}
