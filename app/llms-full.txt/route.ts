import { llmsFull, TEXT_HEADERS } from "@/app/lib/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await llmsFull(), { headers: TEXT_HEADERS });
}
