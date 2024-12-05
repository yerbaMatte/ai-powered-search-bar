"use client";

import React, { useState, useEffect } from "react";
import styles from "./Suggestions.module.scss";
import { suggestionsData } from "@/lib/utils";

type SuggestionsProps = {
  query: string;
};

const Suggestions = ({ query }: SuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([
    ...suggestionsData,
  ]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (query) {
      setSuggestions([...suggestionsData]);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setTimeout(() => setSuggestions([]), 300);
    }
  }, [query]);

  return (
    <div
      className={`${styles.suggestionsContainer} ${
        isVisible ? styles.visible : ""
      }`}
    >
      {suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Search suggestions"
          className={styles.suggestion_list}
        >
          {suggestions.map((item, index) => (
            <li
              key={index}
              role="option"
              style={{
                padding: "10px",
                cursor: "pointer",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Suggestions;
