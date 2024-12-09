"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import styles from "./SearchBar.module.scss";
import useDebounce from "@/hooks/useDebounce";
import useClickOutside from "@/hooks/useClickOutside";
import { debounceTime } from "@/lib/constants";
import dynamic from "next/dynamic";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import SearchInput from "../SearchInput.tsx/SearchInput";
import AriaRegion from "../Aria/AriaRegion";
import { fetchSuggestionsFromAPI } from "@/lib/fetchSuggestions";

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
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { debouncedValue, setDebouncedValue } = useDebounce(
    inputValue,
    debounceTime
  );

  const resetSearchBar = () => {
    setSelectedIndex(-1);
    setSuggestions([]);
    setInputValue("");
    setDebouncedValue("");
    setMessage("");
  };

  useClickOutside(searchBarRef, () => {
    resetSearchBar();
  });

  // handles user's typing before deboucing execution
  useEffect(() => {
    if (!inputValue) resetSearchBar();
  }, [inputValue]);

  //  do NOT re-fetch (guard fn):
  useEffect(() => {
    if (
      suggestions.includes(debouncedValue) ||
      suggestions.length > 0 ||
      !inputValue
    ) {
      return;
    }

    const handleFetch = async () => {
      setMessage(null);
      await fetchSuggestionsFromAPI(
        debouncedValue,
        (fetchedSuggestions) => {
          setSuggestions(fetchedSuggestions);
          if (!fetchedSuggestions.length) {
            resetSearchBar();
            setMessage("No suggestions available.");
          } else {
            setMessage("Here is your results.");
            setSelectedIndex(-1);
          }
        },
        (errorMessage) => {
          setSuggestions([]);
          setMessage(errorMessage);
        }
      );
    };

    handleFetch();
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

  const handleSuggestionSelection = (item: string) => {
    setInputValue(item);
    setDebouncedValue("");
    setSelectedIndex(0);
    setMessage(`Chosen value: ${item}`);
  };

  // derived states - conditional rendering
  const activeIndex =
    selectedIndex >= 0
      ? `suggestion-${filteredSuggestions[selectedIndex]}`
      : undefined;

  const isDebouncing = inputValue && suggestions.length === 0;
  const isLoading = debouncedValue && !suggestions.length && !message;

  return (
    <div ref={searchBarRef} className={styles.component_wrapper}>
      {isDebouncing && (
        <ProgressBarComponent
          {...{ debouncedValue, suggestions, selectedIndex, inputValue }}
        />
      )}
      <AriaRegion {...{ filteredSuggestions, message }} />
      <SearchInput
        {...{
          inputValue,
          activeIndex,
          message,
          setInputValue,
          resetSearchBar,
          selectedIndex,
          filteredSuggestions,
          handleSuggestionSelection,
          setSelectedIndex,
        }}
      />
      {isLoading && <LoadingSpinner size={48} classNames={styles.spinner} />}
      {filteredSuggestions.length > 0 && (
        <SuggestionsDropdownComponent
          {...{ filteredSuggestions, selectedIndex, handleSuggestionSelection }}
        />
      )}
    </div>
  );
};

export default SearchBar;

// input + dropdown (combobox pattern from w3)
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#javascriptandcsssourcecode
