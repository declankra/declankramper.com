"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { JSONUIProvider, Renderer, useUIStream } from "@json-render/react";
import { toast } from "sonner";

import { experimentRegistry } from "@/components/experiment/registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { componentList } from "@/lib/experiment/catalog";
import { cn } from "@/lib/utils";

const BASE_DATA = {
  metrics: {
    revenue: 125000,
    mrr: 48200,
    churn: 0.028,
    activeUsers: 12640,
  },
  trend: {
    revenue: "+12%",
    mrr: "+8%",
    churn: "-0.4%",
    activeUsers: "+3.1%",
  },
  salesByMonth: [
    { label: "Jan", value: 42000 },
    { label: "Feb", value: 51000 },
    { label: "Mar", value: 67000 },
    { label: "Apr", value: 59000 },
    { label: "May", value: 72000 },
  ],
  pipeline: [
    { stage: "Qualified", value: 42 },
    { stage: "Demo", value: 29 },
    { stage: "Trial", value: 18 },
    { stage: "Closed", value: 11 },
  ],
  deals: [
    {
      company: "Evergreen Labs",
      owner: "Ivy",
      amount: 18000,
      stage: "Trial",
      updatedAt: "2026-01-08",
    },
    {
      company: "Skyline Ventures",
      owner: "Omar",
      amount: 9200,
      stage: "Demo",
      updatedAt: "2026-01-10",
    },
    {
      company: "Vanta Systems",
      owner: "Ari",
      amount: 24000,
      stage: "Qualified",
      updatedAt: "2026-01-12",
    },
  ],
  notes: {
    highlight: "Q1 pipeline up 18% month-over-month.",
  },
  filters: {
    region: "North America",
    timeframe: "Last 30 days",
    owner: "All",
  },
};

const PROMPT_SUGGESTIONS = [
  "Create a revenue overview with KPIs, a bar chart, and an alerts section.",
  "Show pipeline health with stage breakdown, trends, and a CTA button.",
  "Build a compact dashboard for sales leaders with cards and a data table.",
  "Design an onboarding status panel with filters and a notification banner.",
];

function cloneData() {
  return JSON.parse(JSON.stringify(BASE_DATA));
}

export default function ExperimentPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [dataSeed, setDataSeed] = useState(0);
  const initialData = useMemo(() => cloneData(), [dataSeed]);

  const { tree, isStreaming, error, send, clear } = useUIStream({
    api: "/api/experiment/generate",
  });

  const hasTree = Boolean(tree && Object.keys(tree.elements).length);

  const actionHandlers = useMemo(
    () => ({
      notify: (params: Record<string, unknown>) => {
        const message = String(params?.message ?? "Action triggered");
        const tone = params?.tone;
        if (tone === "success") {
          toast.success(message);
        } else if (tone === "warning") {
          toast.warning(message);
        } else if (tone === "danger") {
          toast.error(message);
        } else {
          toast(message);
        }
      },
      open_url: (params: Record<string, unknown>) => {
        const url = params?.url;
        if (typeof url === "string") {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      },
      reset_data: () => {
        setDataSeed((prev) => prev + 1);
        toast("Reset demo data");
      },
    }),
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!prompt.trim()) return;
      await send(prompt, { data: initialData });
    },
    [prompt, send, initialData]
  );

  return (
    <div className="relative pt-16 pb-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Experiment
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            JSON-render playground
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Use natural language prompts to generate UI layouts that are constrained
            to a curated component catalog. This is a safe sandbox for exploring
            the dynamic UI system.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prompt the UI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      placeholder="Describe the dashboard you want to see..."
                      disabled={isStreaming}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isStreaming}>
                        {isStreaming ? "Generating" : "Generate"}
                      </Button>
                      {hasTree && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={clear}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPrompt(item)}
                        className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </form>

                {error && (
                  <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-600">
                    {error.message}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[320px] rounded-lg border border-dashed border-border/60 bg-muted/30 p-4">
                  {!hasTree && !isStreaming ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Enter a prompt to render UI components here.
                    </div>
                  ) : (
                    <JSONUIProvider
                      key={dataSeed}
                      registry={experimentRegistry}
                      initialData={initialData}
                      authState={{ isSignedIn: true }}
                      actionHandlers={actionHandlers}
                      navigate={(path) => router.push(path)}
                    >
                      {tree && (
                        <Renderer
                          tree={tree}
                          registry={experimentRegistry}
                          loading={isStreaming}
                        />
                      )}
                    </JSONUIProvider>
                  )}
                </div>
              </CardContent>
            </Card>

            {hasTree && (
              <Card>
                <CardHeader>
                  <CardTitle>JSON output</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-[360px] overflow-auto rounded-lg bg-background p-4 text-xs text-muted-foreground">
                    {JSON.stringify(tree, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The model can reference this data via JSON Pointer paths like
                  <span className="font-medium text-foreground"> /metrics/revenue</span>.
                </p>
                <pre className="max-h-[320px] overflow-auto rounded-lg bg-muted/40 p-4 text-xs text-muted-foreground">
                  {JSON.stringify(initialData, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catalog snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The AI can only emit components listed below. If a prompt asks
                  for something else, it must adapt.
                </p>
                <div className="flex flex-wrap gap-2">
                  {componentList.map((name) => (
                    <Badge key={name} variant="secondary">
                      {name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Try prompts like:</p>
                  <ul className="space-y-1">
                    <li>"Add two KPI cards and a bar chart with a trend note."</li>
                    <li>"Create a table of deals with badges for stage."</li>
                    <li>"Include filters with input fields and a CTA button."</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Actions available:</p>
                  <div className="flex flex-wrap gap-2">
                    {["notify", "open_url", "reset_data"].map((action) => (
                      <span
                        key={action}
                        className={cn(
                          "rounded-full border border-border/60 px-3 py-1 text-xs",
                          "text-muted-foreground"
                        )}
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
