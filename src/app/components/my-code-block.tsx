import { HTMLAttributes, ClassAttributes } from "react";
import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import { cn } from "@/app/lib/utils";

export interface MyCodeBlockProps
  extends HTMLAttributes<HTMLPreElement>,
    ClassAttributes<HTMLPreElement> {}

export default function MyCodeBlock({ className, ...props }: MyCodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const codeEl = preRef.current?.querySelector("code");
    if (codeEl) {
      try {
        hljs.highlightElement(codeEl as HTMLElement);
      } catch (e) {
        // silent fail; highlighting is non-critical
      }
    }
  }, [props.children]);

  return (
    <pre
      ref={preRef}
      className={cn(
        // Keep minimal structural styling; defer colors/background to hljs theme CSS
        "rounded-md text-sm font-medium overflow-x-auto",
        // Remove any Tailwind prose code background overrides inside <pre>
        "[&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit",
        className
      )}
      {...props}
    />
  );
}
