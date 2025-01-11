import { ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react";

interface BreadcrumbNavProps {
  items: {
    href?: string;
    label: string;
    current?: boolean;
  }[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  // Don't render if we only have one item
  if (items.length <= 1) return null;
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList className="text-xs gap-1">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            <BreadcrumbItem className="text-muted-foreground">
              {item.current ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href} asChild>
                  <Link href={item.href || "/"} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbItem className="text-muted-foreground">
                <ChevronRight className="h-3 w-3" />
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}