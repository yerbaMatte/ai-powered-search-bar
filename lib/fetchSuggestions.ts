import isError from "./types";

export const fetchSuggestionsFromAPI = async (
  query: string,
  onSuggestionsFetched: (suggestions: string[]) => void,
  onError: (message: string) => void
) => {
  try {
    const response = await fetch(`/api/openai?query=${query}`);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || "Unexpected error occurred.";
      throw new Error(errorMessage);
    }

    const { suggestions } = await response.json();
    onSuggestionsFetched(suggestions);
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Error fetching suggestions:", error.message);
      onError(error.message || "Something went wrong. Please try again later.");
    } else {
      console.error("Unknown error fetching suggestions:", error);
      onError("Something went wrong. Please try again later.");
    }
  }
};
