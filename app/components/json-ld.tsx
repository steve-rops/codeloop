/**
 * A schema.org block for search engines and assistants. Rendered on the server
 * as a plain script tag; `<` is escaped so no string in the data can close it.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
