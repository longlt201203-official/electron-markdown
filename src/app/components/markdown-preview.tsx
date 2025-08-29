import React, { Suspense } from "react";
const Markdown = React.lazy(() => import("react-markdown"));
import { cn } from "@/app/lib/utils";
import MyCodeBlock from "./my-code-block";
import InlineCode from "./inline-code";

export interface MyMarkdownProps {
  content?: string;
  className?: string;
  emptyPlaceholder?: React.ReactNode; // Shown if no content
}

export default function MarkdownPreview({
  content = "",
  className,
  emptyPlaceholder = <span className="text-muted-foreground">No content</span>,
}: MyMarkdownProps) {
  if (!content.trim()) {
    return (
      <div
        className={cn(
          "prose prose-neutral dark:prose-invert max-w-none prose-pre:p-0",
          "prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm",
          className
        )}
      >
        {emptyPlaceholder}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none prose-pre:p-0",
        "prose-headings:scroll-m-20",
        "prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:not-italic",
        "prose-img:rounded-md",
        "prose-hr:my-4",
        className
      )}
    >
      <Suspense
        fallback={
          <span className="text-muted-foreground">Loading preview...</span>
        }
      >
        <Markdown
          components={{
            h1: ({ children, ...p }) => (
              <h1
                id={children?.toString().toLowerCase()}
                className={cn(
                  // more compact top/bottom margins
                  "group scroll-m-20 text-3xl font-semibold tracking-tight mb-4 mt-2",
                  p.className
                )}
                {...p}
              >
                {children}
              </h1>
            ),
            h2: ({ children, ...p }) => (
              <h2
                id={children?.toString().toLowerCase()}
                className={cn(
                  "group mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mb-3",
                  p.className
                )}
                {...p}
              >
                {children}
              </h2>
            ),
            h3: ({ children, ...p }) => (
              <h3
                id={children?.toString().toLowerCase()}
                className={cn(
                  "group mt-5 scroll-m-20 text-xl font-semibold tracking-tight mb-2",
                  p.className
                )}
                {...p}
              >
                {children}
              </h3>
            ),
            h4: ({ children, ...p }) => (
              <h4
                id={children?.toString().toLowerCase()}
                className={cn(
                  "group mt-4 scroll-m-20 text-lg font-semibold tracking-tight mb-2",
                  p.className
                )}
                {...p}
              >
                {children}
              </h4>
            ),
            h5: ({ children, ...p }) => (
              <h5
                id={children?.toString().toLowerCase()}
                className={cn(
                  "group mt-4 scroll-m-20 text-base font-semibold tracking-tight mb-1",
                  p.className
                )}
                {...p}
              >
                {children}
              </h5>
            ),
            p: ({ children, ...p }) => (
              <p
                className={cn(
                  "leading-6 [&:not(:first-child)]:mt-3",
                  (p as any).className
                )}
                {...p}
              >
                {children}
              </p>
            ),
            span: ({ children, ...p }) => <span {...p}>{children}</span>,
            a: ({ children, ...p }) => (
              <a
                className={cn(
                  "font-medium underline underline-offset-4 text-primary hover:text-primary/80",
                  p.className
                )}
                {...p}
              >
                {children}
              </a>
            ),
            ul: ({ children, ...p }) => (
              <ul
                className={cn("my-4 ml-5 list-disc [&>li]:mt-1", p.className)}
                {...p}
              >
                {children}
              </ul>
            ),
            ol: ({ children, ...p }) => (
              <ol
                className={cn(
                  "my-4 ml-5 list-decimal [&>li]:mt-1",
                  p.className
                )}
                {...p}
              >
                {children}
              </ol>
            ),
            li: ({ children, ...p }) => (
              <li
                className={cn("marker:text-muted-foreground", p.className)}
                {...p}
              >
                {children}
              </li>
            ),
            code: (props) => <InlineCode {...props} />,
            pre: (props) => <MyCodeBlock {...props} />,
          }}
        >
          {content}
        </Markdown>
      </Suspense>
    </div>
  );
}
