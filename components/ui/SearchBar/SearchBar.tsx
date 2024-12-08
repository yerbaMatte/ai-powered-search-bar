"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import styles from "./SearchBar.module.scss";
import useDebounce from "@/hooks/useDebounce";
import useClickOutside from "@/hooks/useClickOutside";
import { debounceTime } from "@/lib/constants";
import dynamic from "next/dynamic";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

// input + dropdown (combobox pattern from w3)
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#javascriptandcsssourcecode

// SuggestionDropdown, ProgressBar import after certain conditions only
const SuggestionsDropdownComponent = dynamic(
  () => import("@/components/ui/SuggestionsDropdown/SuggestionsDropdown")
);
const ProgressBarComponent = dynamic(
  () => import("@/components/ui/ProgressBar/ProgressBar")
);

const SearchBar = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { debouncedValue, setDebouncedValue } = useDebounce(
    inputValue,
    debounceTime
  );
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetSearchBar = () => {
    setSelectedIndex(-1);
    setSuggestions([]);
    setInputValue("");
    setDebouncedValue("");
    setMessage("");
  };

  // click outside component - reset
  useClickOutside(searchBarRef, () => {
    resetSearchBar();
  });

  // handles user's typing before deboucing is executed
  useEffect(() => {
    if (!inputValue) {
      resetSearchBar();
    }
  }, [inputValue]);

  useEffect(() => {
    //  do NOT re-fetch suggestions if:
    // user selects suggestion from dropdown
    // debounced value is invalid
    if (
      suggestions.includes(debouncedValue) ||
      suggestions.length > 0 ||
      !inputValue
    ) {
      return;
    }

    // input validation after debounce time
    const isValid = /^[a-zA-Z\s]{4,32}$/.test(debouncedValue.trim());
    if (!isValid) {
      setMessage("Input: 4-32 letters, no numbers/symbols.");
      return;
    }

    // clear any errors from message area and fetch suggestions
    setMessage(null);

    const fetchSuggestions = async () => {
      setIsLoading(true);

      try {
        setMessage(null);
        const response = await fetch(`/api/openai?query=${debouncedValue}`);
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || "Unexpected error occurred.";
          throw new Error(errorMessage);
        }
        const { suggestions } = await response.json();
        setSuggestions(suggestions);
        if (!suggestions.length) {
          resetSearchBar();
          setMessage("No suggestions available.");
          return;
        }
        setMessage("🚀 Here is your results.");
        setSelectedIndex(-1);
      } catch (error: any) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]); //
        setMessage(
          error.message || "Something went wrong. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

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
    setMessage(`🎉 Chosen value: ${item}`);
  };

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
        <div id="input-instructions" className="sr-only">
          Start typing to search. Suggestions will appear after the progress bar
          completes.
        </div>

        <div aria-live="polite" className="sr-only" id="live-region">
          {filteredSuggestions.length > 0
            ? `Suggestions expanded, ${filteredSuggestions.length} items available.`
            : "Suggestions collapsed."}
        </div>
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
            aria-describedby="input-instructions"
            aria-controls="suggestions-listbox"
            aria-expanded={filteredSuggestions.length > 0}
            aria-activedescendant={
              selectedIndex >= 0
                ? `suggestion-${filteredSuggestions[selectedIndex]}`
                : undefined
            }
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
        {isLoading && <LoadingSpinner size={48} classNames="m-auto my-4" />}
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
