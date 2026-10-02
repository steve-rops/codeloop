/**
 * Form controls in the site's own register: no boxes, no rounding — a label set
 * small and uppercase over a rule that darkens on focus.
 */
export const fieldClass = (hasError: boolean) =>
  `w-full border-b bg-transparent pb-[0.8vw] text-[1.1vw] font-light outline-none transition-colors placeholder:text-muted max-md:text-[16px] max-md:pb-3 ${
    hasError ? "border-danger" : "border-ink/25 focus:border-ink"
  }`;

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="t-xxs text-danger mt-2">
      {message}
    </p>
  );
}

export function Field({
  id,
  label,
  error,
  hideLabel = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hideLabel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "t-xs text-muted mb-[0.8vw] block"}
      >
        {label}
      </label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
