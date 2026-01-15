import { ActionSchema, ValidationCheckSchema, createCatalog } from "@json-render/core";
import { z } from "zod";

export const experimentCatalog = createCatalog({
  name: "Experiment UI",
  components: {
    Card: {
      props: z.object({
        title: z.string().nullable(),
        description: z.string().nullable(),
        padding: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      hasChildren: true,
      description: "Surface container with optional title and description.",
    },
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).nullable(),
        gap: z.enum(["sm", "md", "lg", "xl"]).nullable(),
        align: z.enum(["start", "center", "end", "stretch"]).nullable(),
        justify: z.enum(["start", "center", "end", "between"]).nullable(),
      }),
      hasChildren: true,
      description: "Flex layout for vertical or horizontal stacking.",
    },
    Grid: {
      props: z.object({
        columns: z.number().min(1).max(4).nullable(),
        gap: z.enum(["sm", "md", "lg", "xl"]).nullable(),
      }),
      hasChildren: true,
      description: "Responsive grid layout for cards and widgets.",
    },
    Heading: {
      props: z.object({
        text: z.string(),
        level: z.enum(["h1", "h2", "h3", "h4"]).nullable(),
      }),
      description: "Section heading text.",
    },
    Text: {
      props: z.object({
        content: z.string(),
        tone: z.enum(["default", "muted", "success", "warning", "danger"]).nullable(),
        size: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      description: "Paragraph or supporting text.",
    },
    Metric: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        format: z.enum(["number", "currency", "percent"]).nullable(),
        trend: z.enum(["up", "down", "flat"]).nullable(),
        trendLabel: z.string().nullable(),
      }),
      description: "Key metric with optional trend indicator.",
    },
    Badge: {
      props: z.object({
        text: z.string(),
        variant: z
          .enum(["default", "secondary", "success", "warning", "danger", "outline"])
          .nullable(),
      }),
      description: "Small status badge.",
    },
    Button: {
      props: z.object({
        label: z.string(),
        variant: z
          .enum(["default", "secondary", "outline", "ghost", "destructive", "link"])
          .nullable(),
        size: z.enum(["sm", "md", "lg"]).nullable(),
        action: ActionSchema,
      }),
      description: "Button that triggers a catalog action.",
    },
    Input: {
      props: z.object({
        label: z.string().nullable(),
        bindPath: z.string(),
        placeholder: z.string().nullable(),
        type: z.enum(["text", "email", "number", "url"]).nullable(),
        checks: z.array(ValidationCheckSchema).nullable(),
        validateOn: z.enum(["change", "blur", "submit"]).nullable(),
      }),
      description: "Text input bound to the data model.",
    },
    Table: {
      props: z.object({
        dataPath: z.string(),
        columns: z.array(
          z.object({
            key: z.string(),
            label: z.string(),
            format: z
              .enum(["text", "currency", "percent", "date", "badge"])
              .nullable(),
          })
        ),
        dense: z.boolean().nullable(),
      }),
      description: "Simple data table.",
    },
    Chart: {
      props: z.object({
        type: z.enum(["bar", "line", "area", "pie"]),
        dataPath: z.string(),
        title: z.string().nullable(),
        height: z.number().nullable(),
      }),
      description: "Lightweight chart visualization.",
    },
    Alert: {
      props: z.object({
        title: z.string(),
        message: z.string().nullable(),
        tone: z.enum(["info", "success", "warning", "error"]).nullable(),
      }),
      description: "Alert banner for status or warnings.",
    },
    Divider: {
      props: z.object({
        label: z.string().nullable(),
      }),
      description: "Section divider.",
    },
  },
  actions: {
    notify: {
      params: z.object({
        message: z.string().nullable(),
        tone: z.enum(["default", "success", "warning", "danger"]).nullable(),
      }),
      description: "Show a toast notification.",
    },
    open_url: {
      params: z.object({
        url: z.string(),
      }),
      description: "Open a URL in a new tab.",
    },
    reset_data: {
      description: "Reset the demo data to its defaults.",
    },
  },
  validation: "strict",
});

export const componentList = experimentCatalog.componentNames as string[];
