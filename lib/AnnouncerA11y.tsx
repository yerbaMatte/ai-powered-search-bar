const AnnouncerA11y = ({ children }: { children: string }) => (
  <div role="region" aria-live="polite" className="sr-only">
    {children}
  </div>
);

export default AnnouncerA11y;
