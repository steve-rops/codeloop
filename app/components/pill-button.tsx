import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

/**
 * Pill whose label rolls over on hover: two stacked copies inside a clipped
 * pill, the outgoing one leaving upward as the incoming one arrives from below.
 * A third, invisible copy holds the pill open at the label's natural width so
 * the two moving layers can be absolutely positioned without collapsing it.
 */
function PillInner({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`btn-inner p-2 flex place-items-center text-center ${className}`}
    >
      <span className="btn-ghost">
        <span className="btn-text">{children}</span>
      </span>
      <span className="btn-layer btn-top">
        <span className="btn-text">{children}</span>
      </span>
      <span className="btn-layer btn-bottom">
        <span className="btn-text">{children}</span>
      </span>
    </span>
  );
}

export function PillButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`btn ${className}`}>
      <PillInner className="p-2">{children}</PillInner>
    </Link>
  );
}

/** The same pill as a real button, for form submits and in-page steps. */
export function PillAction({
  children,
  type = "submit",
  onClick,
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn cursor-pointer disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      <PillInner>{children}</PillInner>
    </button>
  );
}
