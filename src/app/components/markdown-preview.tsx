import React, { Suspense, useEffect, useState } from "react";
const Markdown = React.lazy(() => import("react-markdown"));
import { cn } from "@/app/lib/utils";
import MyCodeBlock from "./my-code-block";
import InlineCode from "./inline-code";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
  TableCaption,
} from "./ui/table";
// remark-gfm is ESM; we'll load dynamically to avoid CommonJS import issues

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
  const [remarkPlugins, setRemarkPlugins] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("remark-gfm");
        if (mounted) setRemarkPlugins([mod.default]);
      } catch (err) {
        console.warn("Failed to load remark-gfm", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
          remarkPlugins={remarkPlugins}
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
            blockquote: ({ children, ...p }) => (
              <blockquote
                className={cn(
                  "border-l-4 pl-4 py-1 my-4 italic bg-muted/30 rounded-r-md text-muted-foreground [&>*:last-child]:mb-0",
                  p.className
                )}
                {...p}
              >
                {children}
              </blockquote>
            ),
            table: ({ children, ...p }) => <Table {...p}>{children}</Table>,
            thead: ({ children, ...p }) => (
              <TableHeader {...p}>{children}</TableHeader>
            ),
            tbody: ({ children, ...p }) => (
              <TableBody {...p}>{children}</TableBody>
            ),
            tfoot: ({ children, ...p }) => (
              <TableFooter {...p}>{children}</TableFooter>
            ),
            tr: ({ children, ...p }) => <TableRow {...p}>{children}</TableRow>,
            th: ({ children, ...p }) => (
              <TableHead {...p}>{children}</TableHead>
            ),
            td: ({ children, ...p }) => (
              <TableCell {...p}>{children}</TableCell>
            ),
            caption: ({ children, ...p }) => (
              <TableCaption {...p}>{children}</TableCaption>
            ),
          }}
        >
          {content}
        </Markdown>
      </Suspense>
    </div>
  );
}
