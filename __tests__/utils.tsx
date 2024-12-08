import "@testing-library/jest-dom";
import { RenderResult, render } from "@testing-library/react";
import SearchBar from "@/components/ui/SearchBar/SearchBar";

export const mockSuggestions = Array.from({ length: 8 }).map(
  (_, i) => `suggestion-${i}`
);

export function renderSearchBar(): RenderResult {
  return render(<SearchBar />);
}
