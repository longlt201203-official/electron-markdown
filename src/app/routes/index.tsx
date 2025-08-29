import { createFileRoute } from "@tanstack/react-router";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { Separator } from "../components/ui/separator";
import Editor from "@monaco-editor/react";
import { getDarkOrLightTheme, useTheme } from "../components/theme-provider";
import { useState } from "react";
import MarkdownPreview from "../components/markdown-preview";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme } = useTheme();
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col h-full gap-y-4 overflow-hidden">
      <div className="flex flex-col gap-y-1">
        <div>
          <Button>Save</Button>
        </div>
      </div>
      <Separator />
      <Input
        placeholder="Give a title..."
        className="rounded-none outline-none border-0 shadow-none focus-visible:ring-0 text-4xl! font-semibold"
      />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 min-h-0 overflow-hidden"
      >
        <ResizablePanel defaultSize={50}>
          <Editor
            theme={getDarkOrLightTheme(theme) === "dark" ? "vs-dark" : "vs"}
            language="markdown"
            value={text}
            onChange={(v) => setText(v || "")}
            options={{
              wordWrap: "on",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <MarkdownPreview content={text} className="px-2" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
