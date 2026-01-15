"use client";

import type { Action, ValidationCheck } from "@json-render/core";
import type { ComponentRegistry, ComponentRenderProps } from "@json-render/react";
import type { JSX } from "react";
import { useDataBinding, useDataValue, useFieldValidation } from "@json-render/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const gapClasses: Record<string, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const alignClasses: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClasses: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const textToneClasses: Record<string, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-emerald-500",
  warning: "text-amber-500",
  danger: "text-rose-500",
};

const badgeToneClasses: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  danger: "bg-rose-500/10 text-rose-600 border-rose-500/30",
};

const alertToneClasses: Record<string, string> = {
  info: "border-sky-500/30 bg-sky-500/10 text-sky-700",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  error: "border-rose-500/30 bg-rose-500/10 text-rose-700",
};

const sizeClasses: Record<string, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

type CardProps = {
  title?: string | null;
  description?: string | null;
  padding?: "sm" | "md" | "lg" | null;
};

type StackProps = {
  direction?: "horizontal" | "vertical" | null;
  gap?: "sm" | "md" | "lg" | "xl" | null;
  align?: "start" | "center" | "end" | "stretch" | null;
  justify?: "start" | "center" | "end" | "between" | null;
};

type GridProps = {
  columns?: 1 | 2 | 3 | 4 | null;
  gap?: "sm" | "md" | "lg" | "xl" | null;
};

type HeadingProps = {
  text: string;
  level?: "h1" | "h2" | "h3" | "h4" | null;
};

type TextProps = {
  content: string;
  tone?: "default" | "muted" | "success" | "warning" | "danger" | null;
  size?: "sm" | "md" | "lg" | null;
};

type MetricProps = {
  label: string;
  valuePath: string;
  format?: "number" | "currency" | "percent" | null;
  trend?: "up" | "down" | "flat" | null;
  trendLabel?: string | null;
};

type BadgeProps = {
  text: string;
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline" | null;
};

type ButtonProps = {
  label: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link" | null;
  size?: "sm" | "md" | "lg" | null;
  action: Action;
};

type InputProps = {
  label?: string | null;
  bindPath: string;
  placeholder?: string | null;
  type?: "text" | "email" | "number" | "url" | null;
  checks?: ValidationCheck[] | null;
  validateOn?: "change" | "blur" | "submit" | null;
};

type TableColumn = {
  key: string;
  label: string;
  format?: "text" | "currency" | "percent" | "date" | "badge" | null;
};

type TableProps = {
  dataPath: string;
  columns: TableColumn[];
  dense?: boolean | null;
};

type ChartProps = {
  type: "bar" | "line" | "area" | "pie";
  dataPath: string;
  title?: string | null;
  height?: number | null;
};

type AlertProps = {
  title: string;
  message?: string | null;
  tone?: "info" | "success" | "warning" | "error" | null;
};

type DividerProps = {
  label?: string | null;
};

function formatValue(value: unknown, format?: string | null): string {
  if (value === null || value === undefined) return "—";
  if (format === "currency" && typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (format === "percent") {
    if (typeof value === "number") {
      const normalized = Math.abs(value) <= 1 ? value * 100 : value;
      return `${normalized.toFixed(1)}%`;
    }
    return `${value}%`;
  }
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value);
  }
  if (format === "date") {
    const date = new Date(String(value));
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return String(value);
}

function resolveChartData(raw: unknown): Array<{ label: string; value: number }> {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const record = item as Record<string, unknown>;
    const label = String(
      record.label ??
        record.name ??
        record.title ??
        record.stage ??
        `Item ${index + 1}`
    );
    const value = Number(record.value ?? record.amount ?? record.total ?? 0);
    return { label, value };
  });
}

function renderBarChart(data: Array<{ label: string; value: number }>) {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center">
          <div
            className="w-full rounded-md bg-primary/70"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="mt-2 text-xs text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function renderLineChart(data: Array<{ label: string; value: number }>) {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center">
          <div
            className="w-full rounded-full bg-primary/40"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="mt-2 text-xs text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function renderAreaChart(data: Array<{ label: string; value: number }>) {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center">
          <div
            className="w-full rounded-md bg-primary/20"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="mt-2 text-xs text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function renderPieChart(data: Array<{ label: string; value: number }>) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="space-y-2">
      {data.map((item) => {
        const percent = total > 0 ? (item.value / total) * 100 : 0;
        return (
          <div key={item.label} className="flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {item.label} · {percent.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CardComponent({ element, children }: ComponentRenderProps<CardProps>) {
  const padding = element.props.padding ?? "md";
  const contentPadding =
    padding === "sm" ? "p-4" : padding === "lg" ? "p-8" : "p-6";
  const hasHeader = Boolean(element.props.title || element.props.description);

  return (
    <Card className="border-border/60 bg-card">
      {hasHeader && (
        <CardHeader className={cn(contentPadding)}>
          {element.props.title && <CardTitle>{element.props.title}</CardTitle>}
          {element.props.description && (
            <CardDescription>{element.props.description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(contentPadding, hasHeader && "pt-0")}>
        {children}
      </CardContent>
    </Card>
  );
}

function StackComponent({
  element,
  children,
}: ComponentRenderProps<StackProps>) {
  const direction = element.props.direction ?? "vertical";
  const gap = element.props.gap ?? "md";
  const align = element.props.align ?? "stretch";
  const justify = element.props.justify ?? "start";

  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal" ? "flex-row" : "flex-col",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify]
      )}
    >
      {children}
    </div>
  );
}

function GridComponent({ element, children }: ComponentRenderProps<GridProps>) {
  const columns = element.props.columns ?? 2;
  const gap = element.props.gap ?? "md";

  const columnClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid", columnClasses[columns], gapClasses[gap])}>
      {children}
    </div>
  );
}

function HeadingComponent({ element }: ComponentRenderProps<HeadingProps>) {
  const level = element.props.level ?? "h2";
  const Tag = level as keyof JSX.IntrinsicElements;
  const className =
    level === "h1"
      ? "text-4xl font-semibold tracking-tight"
      : level === "h2"
        ? "text-3xl font-semibold tracking-tight"
        : level === "h3"
          ? "text-2xl font-semibold tracking-tight"
          : "text-xl font-semibold tracking-tight";

  return <Tag className={className}>{element.props.text}</Tag>;
}

function TextComponent({ element }: ComponentRenderProps<TextProps>) {
  const tone = element.props.tone ?? "default";
  const size = element.props.size ?? "md";
  return (
    <p className={cn(textToneClasses[tone], sizeClasses[size])}>
      {element.props.content}
    </p>
  );
}

function MetricComponent({ element }: ComponentRenderProps<MetricProps>) {
  const value = useDataValue(element.props.valuePath);
  const formatted = formatValue(value, element.props.format ?? undefined);
  const trend = element.props.trend ?? "flat";

  return (
    <div className="rounded-lg border border-border/60 bg-background p-4">
      <div className="text-sm text-muted-foreground">
        {element.props.label}
      </div>
      <div className="mt-2 text-2xl font-semibold">{formatted}</div>
      {element.props.trendLabel && (
        <div
          className={cn(
            "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs",
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-600"
              : trend === "down"
                ? "bg-rose-500/10 text-rose-600"
                : "bg-muted text-muted-foreground"
          )}
        >
          {element.props.trendLabel}
        </div>
      )}
    </div>
  );
}

function BadgeComponent({ element }: ComponentRenderProps<BadgeProps>) {
  const variant = element.props.variant ?? "default";
  const isToneVariant = ["success", "warning", "danger"].includes(variant);

  return (
    <Badge
      variant={isToneVariant ? "secondary" : (variant as "default" | "secondary" | "outline")}
      className={cn(isToneVariant && badgeToneClasses[variant])}
    >
      {element.props.text}
    </Badge>
  );
}

function ButtonComponent({
  element,
  onAction,
}: ComponentRenderProps<ButtonProps>) {
  const action = element.props.action;
  const size = element.props.size ?? "md";

  return (
    <Button
      variant={element.props.variant ?? "default"}
      size={size === "md" ? "default" : size}
      onClick={() => action && onAction?.(action)}
    >
      {element.props.label}
    </Button>
  );
}

function InputComponent({ element }: ComponentRenderProps<InputProps>) {
  const [value, setValue] = useDataBinding<string>(element.props.bindPath);
  const checks = element.props.checks ?? undefined;
  const validateOn = element.props.validateOn ?? "blur";
  const validationConfig = checks ? { checks, validateOn } : undefined;
  const { errors, validate, touch, state } = useFieldValidation(
    element.props.bindPath,
    validationConfig
  );

  const handleBlur = () => {
    touch();
    if (validateOn === "blur") {
      validate();
    }
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    if (validateOn === "change") {
      validate();
    }
  };

  return (
    <div className="space-y-2">
      {element.props.label && (
        <label className="text-sm font-medium text-muted-foreground">
          {element.props.label}
        </label>
      )}
      <Input
        type={element.props.type ?? "text"}
        placeholder={element.props.placeholder ?? ""}
        value={value ?? ""}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
      />
      {state.touched && errors.length > 0 && (
        <div className="space-y-1 text-xs text-rose-500">
          {errors.map((error, index) => (
            <p key={`${error}-${index}`}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function TableComponent({ element }: ComponentRenderProps<TableProps>) {
  const rows = useDataValue(element.props.dataPath);
  const data = Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [];
  const dense = element.props.dense ?? false;

  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
          <tr>
            {element.props.columns.map((column) => (
              <th
                key={column.key}
                className={cn("px-4 py-3", dense && "py-2")}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={element.props.columns.length}
                className="px-4 py-6 text-center text-muted-foreground"
              >
                No rows yet.
              </td>
            </tr>
          )}
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-border/40 bg-background"
            >
              {element.props.columns.map((column) => {
                const value = row[column.key];
                if (column.format === "badge") {
                  return (
                    <td key={column.key} className={cn("px-4", dense && "py-2")}> 
                      <Badge>{String(value ?? "")}</Badge>
                    </td>
                  );
                }
                return (
                  <td key={column.key} className={cn("px-4 py-3", dense && "py-2")}> 
                    {formatValue(value, column.format ?? undefined)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartComponent({ element }: ComponentRenderProps<ChartProps>) {
  const raw = useDataValue(element.props.dataPath);
  const data = resolveChartData(raw);

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        No chart data yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 bg-background p-4">
      {element.props.title && (
        <div className="mb-3 text-sm font-medium text-muted-foreground">
          {element.props.title}
        </div>
      )}
      {element.props.type === "bar" && renderBarChart(data)}
      {element.props.type === "line" && renderLineChart(data)}
      {element.props.type === "area" && renderAreaChart(data)}
      {element.props.type === "pie" && renderPieChart(data)}
    </div>
  );
}

function AlertComponent({ element }: ComponentRenderProps<AlertProps>) {
  const tone = element.props.tone ?? "info";
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        alertToneClasses[tone]
      )}
    >
      <div className="font-medium">{element.props.title}</div>
      {element.props.message && (
        <div className="mt-1 text-sm text-muted-foreground">
          {element.props.message}
        </div>
      )}
    </div>
  );
}

function DividerComponent({ element }: ComponentRenderProps<DividerProps>) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      {element.props.label && (
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {element.props.label}
        </span>
      )}
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export const experimentRegistry: ComponentRegistry = {
  Card: CardComponent,
  Stack: StackComponent,
  Grid: GridComponent,
  Heading: HeadingComponent,
  Text: TextComponent,
  Metric: MetricComponent,
  Badge: BadgeComponent,
  Button: ButtonComponent,
  Input: InputComponent,
  Table: TableComponent,
  Chart: ChartComponent,
  Alert: AlertComponent,
  Divider: DividerComponent,
};
