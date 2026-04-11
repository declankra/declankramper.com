import { buildLlmsFull } from "@/lib/candidate-profile";

export async function GET() {
  return new Response(buildLlmsFull(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
