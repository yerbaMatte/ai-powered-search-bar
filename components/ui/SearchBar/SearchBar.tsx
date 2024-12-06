"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./SearchBar.module.scss";
import SuggestionsDropdown from "../SuggestionsDropdown/SuggestionsDropdown";
import useDebounce from "@/hooks/useDebounce";
import useClickOutside from "@/hooks/useClickOutside";
import AnnouncerA11y from "@/lib/AnnouncerA11y";

const debounceTime = 500;

const SearchBar = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [fetchBlocked, setFetchBlocked] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const debouncedInputValue = useDebounce(inputValue, debounceTime);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedInputValue?.trim() && !fetchBlocked) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `/api/countries?query=${debouncedInputValue}`
          );
          if (response.ok) {
            const json = await response.json();
            setSuggestions(json);
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
  }, [debouncedInputValue, fetchBlocked]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    if (!value) {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
    setInputValue(value);
    setFetchBlocked(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setInputValue("");
      setSuggestions([]);
      setSelectedIndex(-1);
    } else if (e.key === "ArrowDown") {
      if (selectedIndex < suggestions.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    } else if (e.key === "ArrowUp") {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const selectedSuggestion = suggestions[selectedIndex];
      handleSuggestionSelect(selectedSuggestion);
    }
  };

  const handleSuggestionSelect = (value: string) => {
    setInputValue(value);
    setFetchBlocked(true);
    setSuggestions([]);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue && !suggestions.includes(inputValue)) return;
    console.log("Search submitted:", inputValue);
  };

  useClickOutside(searchBarRef, () => {
    setInputValue("");
    setSuggestions([]);
    setSelectedIndex(-1);
  });

  return (
    <form className={styles.input_wrapper} onSubmit={handleFormSubmit}>
      <div className={styles.input_wrapper} ref={searchBarRef}>
        <label htmlFor="search-bar">
          <span className="sr-only">Search countries</span>
        </label>
        <input
          id="search-bar"
          type="text"
          value={inputValue || ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type here ..."
          className={styles.input}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={suggestions.length > 0}
        />
        {/* Notify user how many suggestions are in the list */}
        <AnnouncerA11y>{`List has ${suggestions.length} search suggestions.`}</AnnouncerA11y>
        <SuggestionsDropdown
          data={suggestions}
          selectedIndex={selectedIndex}
          handleSuggestionSelection={handleSuggestionSelect}
        />
        {/* Notify user if there is no any suggestion */}
        {!suggestions.length && (
          <div className="sr-only" aria-live="assertive">
            No suggestions found.
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
