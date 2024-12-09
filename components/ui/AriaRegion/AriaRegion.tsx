type AriaRegionProps = {
  message?: string | null;
  filteredSuggestions: string[];
};

export default function AriaRegion({
  message,
  filteredSuggestions,
}: AriaRegionProps) {
  return (
    <>
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
    </>
  );
}
