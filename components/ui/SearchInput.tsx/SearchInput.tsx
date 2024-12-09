import styles from "./SearchInput.module.scss";

interface SearchInputProps {
  message: string | null;
  inputValue: string;
  activeIndex: string | undefined;
  setInputValue: (value: string) => void;
  resetSearchBar: () => void;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedIndex: number;
  filteredSuggestions: string[];
  handleSuggestionSelection: (item: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  inputValue,
  activeIndex,
  message,
  setInputValue,
  handleSuggestionSelection,
  resetSearchBar,
  setSelectedIndex,
  selectedIndex,
  filteredSuggestions,
}) => {
  // onKeyDown
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

  return (
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
        aria-label="Start typing to search. Suggestions will appear after the progress bar completes."
        aria-controls="suggestions-listbox"
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
  );
};

export default SearchInput;
