/**
 * Reads an ordered list out of a message catalogue.
 *
 * next-intl messages are objects, not arrays, so lists are stored under numeric
 * keys ("0", "1", …) and read back with `t.raw`. Object key order is insertion
 * order for these, which is the order they are written in the JSON.
 */
export function messagesList<T = string>(raw: unknown): T[] {
  // A plain string would otherwise be split into its characters.
  if (typeof raw === "string") return [raw as T];
  return Object.values((raw ?? {}) as Record<string, T>);
}
