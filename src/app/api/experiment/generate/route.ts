import { streamText } from "ai";
import { generateCatalogPrompt } from "@json-render/core";

import { componentList, experimentCatalog } from "@/lib/experiment/catalog";

export const maxDuration = 30;

const CATALOG_PROMPT = generateCatalogPrompt(experimentCatalog);

const SYSTEM_PROMPT = `You are a UI generator that outputs JSONL patches for a flat UI tree.

${CATALOG_PROMPT}

AVAILABLE COMPONENTS:
${componentList.join(", ")}

COMPONENT DETAILS:
- Card: { title?: string | null, description?: string | null, padding?: "sm"|"md"|"lg" | null }
- Stack: { direction?: "horizontal"|"vertical" | null, gap?: "sm"|"md"|"lg"|"xl" | null, align?: "start"|"center"|"end"|"stretch" | null, justify?: "start"|"center"|"end"|"between" | null }
- Grid: { columns?: 1-4 | null, gap?: "sm"|"md"|"lg"|"xl" | null }
- Heading: { text: string, level?: "h1"|"h2"|"h3"|"h4" | null }
- Text: { content: string, tone?: "default"|"muted"|"success"|"warning"|"danger" | null, size?: "sm"|"md"|"lg" | null }
- Metric: { label: string, valuePath: string, format?: "number"|"currency"|"percent" | null, trend?: "up"|"down"|"flat" | null, trendLabel?: string | null }
- Badge: { text: string, variant?: "default"|"secondary"|"success"|"warning"|"danger"|"outline" | null }
- Button: { label: string, variant?: "default"|"secondary"|"outline"|"ghost"|"destructive"|"link" | null, size?: "sm"|"md"|"lg" | null, action: Action }
- Input: { label?: string | null, bindPath: string, placeholder?: string | null, type?: "text"|"email"|"number"|"url" | null, checks?: ValidationCheck[] | null, validateOn?: "change"|"blur"|"submit" | null }
- Table: { dataPath: string, columns: [{ key: string, label: string, format?: "text"|"currency"|"percent"|"date"|"badge" | null }], dense?: boolean | null }
- Chart: { type: "bar"|"line"|"area"|"pie", dataPath: string, title?: string | null, height?: number | null }
- Alert: { title: string, message?: string | null, tone?: "info"|"success"|"warning"|"error" | null }
- Divider: { label?: string | null }

ACTION SHAPE:
{ "name": "notify"|"open_url"|"reset_data", "params"?: { ... } }

DATA BINDING:
- valuePath uses JSON Pointer, e.g. "/metrics/revenue"
- dataPath uses JSON Pointer for arrays, e.g. "/salesByMonth"

OUTPUT FORMAT:
Return JSONL where each line is a patch operation. Use a FLAT key-based structure:
- {"op":"set","path":"/root","value":"root-key"}
- {"op":"add","path":"/elements/root-key","value":{...}}

RULES:
1. First set /root to the root element's key.
2. Add each element with a unique key using /elements/{key}.
3. Parents list child keys in their "children" array.
4. Stream elements progressively: parent first, then children.
5. Output JSONL only. No extra commentary.

EXAMPLE:
{"op":"set","path":"/root","value":"main-card"}
{"op":"add","path":"/elements/main-card","value":{"key":"main-card","type":"Card","props":{"title":"Revenue Overview","padding":"md"},"children":["metrics"]}}
{"op":"add","path":"/elements/metrics","value":{"key":"metrics","type":"Grid","props":{"columns":3,"gap":"md"},"children":["revenue","mrr","churn"]}}
{"op":"add","path":"/elements/revenue","value":{"key":"revenue","type":"Metric","props":{"label":"Revenue","valuePath":"/metrics/revenue","format":"currency","trend":"up","trendLabel":"+12%"}}}

Generate JSONL patches now:`;

export async function POST(req: Request) {
  const { prompt, context, currentTree } = await req.json();

  let fullPrompt = prompt ?? "";

  if (context?.data) {
    fullPrompt += `\n\nAVAILABLE DATA:\n${JSON.stringify(context.data, null, 2)}`;
  }

  if (currentTree) {
    fullPrompt += `\n\nCURRENT UI TREE:\n${JSON.stringify(currentTree, null, 2)}`;
  }

  const result = streamText({
    model: "google/gemini-3-flash",
    system: SYSTEM_PROMPT,
    prompt: fullPrompt,
    temperature: 0.4,
  });

  return result.toTextStreamResponse();
}
