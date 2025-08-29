import { HTMLAttributes, ClassAttributes } from "react";
import { cn } from "@/app/lib/utils";

export interface MyCodeBlockProps
  extends HTMLAttributes<HTMLElement>,
    ClassAttributes<HTMLElement> {}

export default function InlineCode({ className, ...props }: MyCodeBlockProps) {
  return (
    <code
      className={cn(
        // Base styling
        "relative rounded border border-border/40 bg-muted/70 px-1.5 py-0.5 font-mono text-[0.75rem] leading-snug",
        // Color & theme adjustments
        "text-foreground/90 dark:border-border/30 dark:bg-muted/50",
        // Improve wrapping behavior inside prose paragraphs
        "break-words whitespace-pre-wrap",
        className
      )}
      {...props}
    />
  );
}
