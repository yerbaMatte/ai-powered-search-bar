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
  const dropdownRef = useRef<HTMLUListElement>(null);
  const isVisible = data.length > 0;

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
  }, [selectedIndex]);

  return (
    <>
      <div
        className={`${styles.suggestions_container} ${
          isVisible ? styles.suggestions_expanded : ""
        } `}
      >
        {isVisible && (
          <>
            <ul
              ref={dropdownRef}
              className={styles.suggestion_list}
              id="suggestions-listbox"
              role="listbox"
              aria-label="suggestions list"
            >
              {data.map((item, index) => {
                const isSelected = selectedIndex === index;

                return (
                  <li
                    id={`suggestion-${item}`}
                    key={`suggestion-${item}`}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    className={`${styles.suggestion_item} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() => handleSuggestionSelection(item)}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default SuggestionsDropdown;
