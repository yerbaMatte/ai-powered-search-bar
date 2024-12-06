"use client";

import styles from "./SuggestionsDropdown.module.scss";
import { useEffect, useRef } from "react";

type SuggestionsDropdownProps = {
  data: string[];
  selectedIndex: number;
  handleSuggestionSelection: (value: string) => void;
};

const SuggestionsDropdown = ({
  data,
  selectedIndex,
  handleSuggestionSelection,
}: SuggestionsDropdownProps) => {
  const isVisible = data.length > 0;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dropdownRef.current && selectedIndex >= 0) {
      const listItem =
        dropdownRef.current.querySelectorAll("li")[selectedIndex];

      if (listItem) {
        listItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex, data]);

  return (
    <div
      className={styles.suggestions_container}
      data-visible={isVisible ? "true" : "false"}
      ref={dropdownRef}
      role="listbox"
      aria-expanded={isVisible}
      id="suggestions-list"
    >
      {isVisible && (
        <ul
          role="listbox"
          aria-label="Search suggestions"
          className={styles.suggestion_list}
        >
          {data.map((item, index) => (
            <li
              key={`${item}-${index}`}
              role="option"
              aria-selected={selectedIndex === index}
              className={`${styles.suggestion_item} ${
                selectedIndex === index ? styles.selected : ""
              }`}
              onClick={() => handleSuggestionSelection(item)}
              tabIndex={selectedIndex === index ? 0 : -1}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestionsDropdown;
