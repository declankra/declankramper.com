import { buildLlmsIndex } from "@/lib/candidate-profile";

export async function GET() {
  return new Response(buildLlmsIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
