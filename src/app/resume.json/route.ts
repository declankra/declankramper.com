import { resumeJson } from "@/lib/candidate-profile";

export async function GET() {
  return Response.json(resumeJson);
}
