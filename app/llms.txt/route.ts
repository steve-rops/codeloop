import { llmsIndex, TEXT_HEADERS } from "@/app/lib/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await llmsIndex(), { headers: TEXT_HEADERS });
}
