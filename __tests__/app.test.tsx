import { fireEvent, waitFor } from "@testing-library/react";
import { mockSuggestions, renderSearchBar } from "./utils";

const debounceTime = 3000;
describe("Application", () => {
  describe("e2e", () => {
    test("user types and selects a suggestion from the dropdown", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ suggestions: mockSuggestions }),
      });
      const { getByRole, queryByRole } = renderSearchBar();

      const inputElement = getByRole("combobox");
      fireEvent.change(inputElement, { target: { value: "test" } });
      await waitFor(() => {
        expect(getByRole("progress-bar")).toBeInTheDocument();
      });
      await waitFor(
        () => {
          expect(global.fetch).toHaveBeenCalledWith("/api/openai?query=test");
        },
        { timeout: debounceTime }
      );
      await waitFor(() => {
        expect(queryByRole("progress-bar")).not.toBeInTheDocument();

        mockSuggestions.forEach((suggestion) => {
          expect(getByRole("option", { name: suggestion })).toBeInTheDocument();
        });
      });

      fireEvent.keyDown(inputElement, { key: "ArrowDown", code: "ArrowDown" });

      await waitFor(() => {
        const selectedItem = getByRole("option", {
          name: mockSuggestions[0],
        });

        expect(selectedItem).toHaveAttribute("aria-selected", "true");
      });

      fireEvent.keyDown(inputElement, { key: "ArrowDown", code: "ArrowDown" });

      await waitFor(() => {
        const selectedItem = getByRole("option", {
          name: mockSuggestions[1],
        });

        expect(selectedItem).toHaveAttribute("aria-selected", "true");
      });

      fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });
      await waitFor(() => {
        expect(inputElement).toHaveValue(mockSuggestions[1]);
      });

      await waitFor(() => {
        expect(queryByRole("listbox")).toBeInTheDocument();
      });
    });
  });
  describe("Units", () => {
    describe("Clear Button Behavior", () => {
      test("clear button clears the input", () => {
        const { getByRole, getByLabelText } = renderSearchBar();
        const inputElement = getByRole("combobox");

        fireEvent.change(inputElement, { target: { value: "Test" } });

        const clearButton = getByLabelText("clear search");

        fireEvent.click(clearButton);

        expect(inputElement).toHaveValue("");
      });

      test("renders search input and shows clear button when input is not empty", () => {
        const { getByRole, queryByLabelText, getByLabelText } =
          renderSearchBar();
        const inputElement = getByRole("combobox");
        let clearButton = queryByLabelText("clear search");

        expect(clearButton).toBeNull();

        fireEvent.change(inputElement, {
          target: { value: "Show me close button!" },
        });

        clearButton = getByLabelText("clear search");

        expect(clearButton).toBeInTheDocument();
      });
    });

    describe("Input Validation", () => {
      test("renders a message when no valid input is provided", async () => {
        const { queryAllByText, getByRole } = renderSearchBar();
        const inputElement = getByRole("combobox");

        fireEvent.change(inputElement, { target: { value: "123" } });

        await waitFor(
          () => {
            const messages = queryAllByText(
              /Input: 4-32 letters, no numbers\/symbols./i
            );
            expect(messages[0]).toBeInTheDocument();
          },
          { timeout: debounceTime }
        );
      });
    });

    describe("Error Handling and Data Fetching", () => {
      test("displays an error message when the API call fails", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({
            error: "Failed to fetch suggestions from OpenAI.",
          }),
        });

        const { getByRole, queryAllByText } = renderSearchBar();
        const inputElement = getByRole("combobox");

        fireEvent.change(inputElement, { target: { value: "test" } });

        await waitFor(
          () => {
            const errorMessages = queryAllByText(
              "Failed to fetch suggestions from OpenAI."
            );
            expect(errorMessages.length).toBe(2);
          },
          { timeout: debounceTime }
        );
      });
      test("displays a message when no suggestions are available", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ suggestions: [] }),
        });

        const { getByRole, queryAllByText } = renderSearchBar();
        const inputElement = getByRole("combobox");

        fireEvent.change(inputElement, { target: { value: "test" } });

        await waitFor(
          () => {
            expect(queryAllByText("No suggestions available.").length).toBe(2);
          },
          { timeout: debounceTime }
        );
      });
    });

    describe("Suggestion Handling", () => {
      beforeEach(() => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => ({ suggestions: mockSuggestions }),
        });
      });
      test("suggestions are highlighted when using Arrow keys", async () => {
        const { getByRole, queryByRole } = renderSearchBar();
        const inputElement = getByRole("combobox");

        fireEvent.change(inputElement, { target: { value: "test" } });

        await waitFor(() => {
          expect(getByRole("progress-bar")).toBeInTheDocument();
        });

        await waitFor(
          () => {
            expect(global.fetch).toHaveBeenCalledWith("/api/openai?query=test");
          },
          { timeout: debounceTime }
        );

        await waitFor(() => {
          expect(queryByRole("progress-bar")).not.toBeInTheDocument();
          mockSuggestions.forEach((suggestion) => {
            expect(
              getByRole("option", { name: suggestion })
            ).toBeInTheDocument();
          });
        });

        fireEvent.keyDown(inputElement, {
          key: "ArrowDown",
          code: "ArrowDown",
        });

        await waitFor(() => {
          const selectedItem = getByRole("option", {
            name: mockSuggestions[0],
          });
          expect(selectedItem).toHaveAttribute("aria-selected", "true");
        });

        fireEvent.keyDown(inputElement, {
          key: "ArrowDown",
          code: "ArrowDown",
        });

        await waitFor(() => {
          const selectedItem = getByRole("option", {
            name: mockSuggestions[1],
          });
          expect(selectedItem).toHaveAttribute("aria-selected", "true");
        });

        fireEvent.keyDown(inputElement, { key: "ArrowUp", code: "ArrowUp" });

        await waitFor(() => {
          const selectedItem = getByRole("option", {
            name: mockSuggestions[0],
          });
          expect(selectedItem).toHaveAttribute("aria-selected", "true");
        });
      });

      test("pressing Escape key clears the search input when dropdown and data are visible", async () => {
        const { getByRole, queryByRole } = renderSearchBar();
        const inputElement = getByRole("combobox");

        fireEvent.change(inputElement, { target: { value: "test" } });

        await waitFor(
          () => {
            expect(getByRole("listbox")).toBeInTheDocument();
          },
          { timeout: debounceTime }
        );

        expect(inputElement).toHaveValue("test");

        fireEvent.keyDown(inputElement, { key: "Escape", code: "Escape" });

        await waitFor(() => {
          expect(inputElement).toHaveValue("");
        });
        await waitFor(() => {
          expect(queryByRole("listbox")).toBeNull();
        });
      });

      test("user types and suggestions are fetched", async () => {
        const { getByRole, queryByRole } = renderSearchBar();
        const inputElement = getByRole("combobox");

        fireEvent.change(inputElement, { target: { value: "test" } });

        await waitFor(() => {
          expect(getByRole("progress-bar")).toBeInTheDocument();
        });

        await waitFor(
          () => {
            expect(global.fetch).toHaveBeenCalledWith("/api/openai?query=test");
          },
          { timeout: debounceTime }
        );

        await waitFor(() => {
          expect(queryByRole("progress-bar")).not.toBeInTheDocument();
          mockSuggestions.forEach((suggestion) => {
            expect(
              getByRole("option", { name: suggestion })
            ).toBeInTheDocument();
          });
        });
      });

      test("Selects suggestion when Enter key is pressed", async () => {
        const { getByRole, getAllByRole, queryAllByRole } = renderSearchBar();

        const inputElement = getByRole("combobox");

        fireEvent.change(inputElement, { target: { value: "test" } });

        await waitFor(
          () =>
            expect(global.fetch).toHaveBeenCalledWith("/api/openai?query=test"),
          { timeout: debounceTime }
        );

        await waitFor(() => {
          const suggestionItems = getAllByRole("option");
          expect(suggestionItems.length).toBeGreaterThan(0);
        });

        fireEvent.keyDown(inputElement, {
          key: "ArrowDown",
          code: "ArrowDown",
        });

        await waitFor(() => {
          const highlightedItem = getByRole("option", {
            name: mockSuggestions[0],
          });
          expect(highlightedItem).toHaveAttribute("aria-selected", "true");
        });

        fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

        await waitFor(() => {
          expect(inputElement).toHaveValue(mockSuggestions[0]);
        });

        await waitFor(() => {
          const optionItems = queryAllByRole("option");
          expect(optionItems.length).toBe(1);
          expect(optionItems[0]).toHaveTextContent(mockSuggestions[0]);
        });

        expect(inputElement).toHaveValue(mockSuggestions[0]);
      });
    });
  });
});
