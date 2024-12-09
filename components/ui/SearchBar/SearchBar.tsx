"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import styles from "./SearchBar.module.scss";
import useDebounce from "@/hooks/useDebounce";
import useClickOutside from "@/hooks/useClickOutside";
import { debounceTime } from "@/lib/constants";
import dynamic from "next/dynamic";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useSuggestions } from "@/hooks/useSuggestions";

const SuggestionsDropdownComponent = dynamic(
  () => import("@/components/ui/SuggestionsDropdown/SuggestionsDropdown")
);
const ProgressBarComponent = dynamic(
  () => import("@/components/ui/ProgressBar/ProgressBar")
);

const SearchBar = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const { debouncedValue, setDebouncedValue } = useDebounce(
    inputValue,
    debounceTime
  );

  const { suggestions, setSuggestions, message, setMessage } =
    useSuggestions(debouncedValue);

  const isLoading = debouncedValue && !suggestions.length && !message;

  const resetSearchBar = () => {
    setSelectedIndex(-1);
    setSuggestions([]);
    setInputValue("");
    setDebouncedValue("");
    setMessage("");
  };

  useClickOutside(searchBarRef, () => {
    resetSearchBar(); // click outside component - reset
  });

  useEffect(() => {
    !inputValue && resetSearchBar(); // when input is empty string reset
    inputValue === debouncedValue && setSelectedIndex(0); // when new data is fetched - set the index to 0
  }, [inputValue]);

  const memoizedSuggestions = useMemo(() => {
    return suggestions.map((suggestion) => suggestion.trim());
  }, [suggestions]);

  const filteredSuggestions = useMemo(() => {
    if (!inputValue) return [];
    if (inputValue === debouncedValue) return suggestions;
    return memoizedSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, memoizedSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredSuggestions.length) return;
    if (e.key === "Escape") {
      resetSearchBar();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSuggestionSelection(filteredSuggestions[selectedIndex]);
    }
  };

  const handleSuggestionSelection = (item: string) => {
    setInputValue(item);
    setDebouncedValue("");
    setSelectedIndex(0);
    setMessage(`Chosen value: ${item}`);
  };

  const activeIndex =
    selectedIndex >= 0
      ? `suggestion-${filteredSuggestions[selectedIndex]}`
      : undefined;

  return (
    <div ref={searchBarRef} className={styles.component_wrapper}>
      {inputValue && suggestions.length === 0 && (
        <ProgressBarComponent
          debouncedValue={debouncedValue}
          suggestions={filteredSuggestions}
          selectedIndex={selectedIndex}
          inputValue={inputValue}
        />
      )}
      <div className={styles.combobox}>
        <div aria-live="assertive" className="sr-only" id="live-region">
          {message && message !== "" ? message : ""}
        </div>
        <div className={styles.input_container}>
          {message && <p className={styles.message}>{message}</p>}
          <input
            id="search-bar"
            type="text"
            value={inputValue || ""}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search now"
            className={styles.input}
            role="combobox"
            aria-labelledby="input-instructions"
            aria-description="Start typing to search. Suggestions will appear after the progress bar completes."
            aria-controls="suggestions-listbox"
            aria-expanded={filteredSuggestions.length > 0}
            aria-activedescendant={activeIndex}
          />
          {inputValue && (
            <button
              type="button"
              className={styles.clear_button}
              onClick={resetSearchBar}
              aria-label="clear search"
            >
              &times;
            </button>
          )}
        </div>
        <div className="absolute top-9 left-0 w-full">
          {isLoading && <LoadingSpinner size={48} classNames="m-auto my-4" />}
        </div>
        {filteredSuggestions.length > 0 && (
          <SuggestionsDropdownComponent
            data={filteredSuggestions}
            selectedIndex={selectedIndex}
            handleSuggestionSelection={handleSuggestionSelection}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;

// input + dropdown (combobox pattern from w3)
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#javascriptandcsssourcecode
