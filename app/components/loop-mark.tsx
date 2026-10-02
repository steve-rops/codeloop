/** The infinity-loop wordmark glyph, stroked with the cyan → violet gradient. */
export function LoopMark({ id = "mark" }: { id?: string }) {
  return (
    <svg viewBox="0 0 200 100" width="40" height="20" aria-hidden="true">
      <defs>
        <path
          id={`loop-path-${id}`}
          fill="none"
          d="M 100 50 C 130 5, 190 5, 190 50 C 190 95, 130 95, 100 50 C 70 5, 10 5, 10 50 C 10 95, 70 95, 100 50 Z"
        />
        <linearGradient id={`loop-fill-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <use
        href={`#loop-path-${id}`}
        fill="none"
        stroke={`url(#loop-fill-${id})`}
        strokeWidth="6"
      />
    </svg>
  );
}
