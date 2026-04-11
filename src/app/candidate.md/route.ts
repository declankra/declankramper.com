import { buildCandidateMarkdown } from "@/lib/candidate-profile";

export async function GET() {
  return new Response(buildCandidateMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
