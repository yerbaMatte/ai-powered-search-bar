import { useState, useEffect } from "react";

export const useSuggestions = (debouncedValue: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    //  do NOT re-fetch suggestions if:
    if (
      // user selects suggestion from dropdown
      suggestions.includes(debouncedValue) ||
      suggestions.length > 0 ||
      !debouncedValue
    ) {
      return;
    }

    const fetchSuggestions = async () => {
      setMessage(null);

      try {
        const response = await fetch(`/api/openai?query=${debouncedValue}`);

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || "Unexpected error occurred.";
          throw new Error(errorMessage);
        }
        const { suggestions } = await response.json();
        setSuggestions(suggestions);
        setMessage("Here is your results.");
      } catch (error: any) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]); //
        setMessage(
          error.message || "Something went wrong. Please try again later."
        );
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  return { suggestions, setSuggestions, message, setMessage };
};
