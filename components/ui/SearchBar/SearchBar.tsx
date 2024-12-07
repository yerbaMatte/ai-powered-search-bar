"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./SearchBar.module.scss";
import useDebounce from "@/hooks/useDebounce";
import useClickOutside from "@/hooks/useClickOutside";
import { debounceTime } from "@/lib/constants";
import dynamic from "next/dynamic";

const SuggestionsDropdownComponent = dynamic(
  () => import("@/components/ui/SuggestionsDropdown/SuggestionsDropdown")
);

// input + dropdown (searchbar pattern from w3)
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#javascriptandcsssourcecode

const SearchBar = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const debouncedInputValue = useDebounce(inputValue, debounceTime);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const resetSearchBar = () => {
    setInputValue("");
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  useClickOutside(searchBarRef, () => {
    resetSearchBar();
  });

  useEffect(() => {
    if (debouncedInputValue?.trim() && !suggestions.includes(inputValue)) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `/api/countries?query=${debouncedInputValue}`
          );
          if (response.ok) {
            const countries = await response.json();
            setSuggestions([...countries]);
          } else {
            setSuggestions([]);
          }
        } catch {
          setSuggestions([]);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedInputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    if (!value) {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
    setInputValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "Escape") {
      resetSearchBar();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      setInputValue(suggestions[selectedIndex]);
    }
  };

  return (
    <div ref={searchBarRef} className={styles.component_wrapper}>
      <div className={styles.combobox}>
        <div id="input-instructions" className="sr-only">
          Try to find the country you like, start typing
        </div>
        <div aria-live="polite" className="sr-only" id="live-region">
          {suggestions.length > 0
            ? `Suggestions expanded, ${suggestions.length} items available.`
            : "Suggestions collapsed."}
        </div>
        <div className={styles.input_container}>
          <input
            id="search-bar"
            type="text"
            value={inputValue || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search now"
            className={styles.input}
            role="combobox"
            aria-labelledby="input-instructions"
            aria-describedby="input-instructions"
            aria-controls="suggestions-listbox"
            aria-expanded={suggestions.length > 0}
            aria-activedescendant={
              selectedIndex >= 0
                ? `suggestion-${suggestions[selectedIndex]}`
                : undefined
            }
          />
          {inputValue && (
            <button
              type="button"
              className={styles.clear_button}
              onClick={resetSearchBar}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <SuggestionsDropdownComponent
            data={suggestions}
            selectedIndex={selectedIndex}
            handleSuggestionSelection={setInputValue}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
