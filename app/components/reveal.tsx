"use client";

import { isReady, onReady } from "../lib/ready";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";


type RevealProps = {
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * How far into the viewport the element travels before firing. The default
   * holds back until the section is properly on screen, so the reveal is
   * something you watch rather than something that finished before you arrived.
   */
  margin?: string;
  children: ReactNode;
};

/**
 * Marks a subtree as revealed, once it has scrolled into view *and* the opening
 * sequence has finished — a section sitting above the fold would otherwise play
 * out behind the preloader.
 *
 * Nothing animates on its own — children pick a primitive (`a-up`, `a-fade-up`,
 * `a-fade-rotate`, `a-fill-w`, `a-fill-h`) and this adds the one class those
 * primitives key off. Keeping the trigger and the motion separate is what lets
 * a whole section fire on a single observer and still stagger internally.
 */
export function Reveal({
  as: Tag = "div",
  className = "",
  margin = "0px 0px -12% 0px",
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [inview, setInview] = useState(false);
  const [opened, setOpened] = useState(isReady);

  useEffect(() => onReady(() => setOpened(true)), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInview(true);
        // Reveals never play backwards, so the observer's work is done.
        observer.disconnect();
      },
      { rootMargin: margin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <Tag
      ref={ref}
      className={inview && opened ? `is-inview ${className}` : className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
