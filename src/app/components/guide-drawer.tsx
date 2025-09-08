import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import MarkdownPreview from "./markdown-preview";
// Import the bundled markdown file (raw contents) via Vite.
// The ?raw suffix ensures we get a string at build time instead of attempting to parse it.
import guideMarkdown from "../../../template.md?raw";

type GuideDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// A fixed, draggable panel that shows the Markdown guide.
export function GuideDrawer({ open, onOpenChange }: GuideDrawerProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 24, y: 96 });
  const dragState = useRef<{ dragging: boolean; offsetX: number; offsetY: number }>({
    dragging: false,
    offsetX: 0,
    offsetY: 0,
  });

  // Keep the panel within the viewport bounds
  const clampToViewport = useCallback((x: number, y: number) => {
    const panel = panelRef.current;
    if (!panel) return { x, y };
    const { innerWidth, innerHeight } = window;
    const rect = panel.getBoundingClientRect();
    const maxX = Math.max(0, innerWidth - rect.width - 8);
    const maxY = Math.max(0, innerHeight - rect.height - 8);
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(8, y), maxY),
    };
  }, []);

  // Initialize near bottom-right on first open
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    // Defer to next frame to get correct size
    const id = requestAnimationFrame(() => {
      const rect = panel.getBoundingClientRect();
      const x = window.innerWidth - rect.width - 24;
      const y = window.innerHeight - rect.height - 24;
      setPos(clampToViewport(x, y));
    });
    return () => cancelAnimationFrame(id);
  }, [open, clampToViewport]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragState.current.dragging) return;
      const x = e.clientX - dragState.current.offsetX;
      const y = e.clientY - dragState.current.offsetY;
      setPos((prev) => clampToViewport(x, y));
      e.preventDefault();
    };
    const onUp = () => {
      dragState.current.dragging = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [clampToViewport]);

  const onMouseDownHeader = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    dragState.current.dragging = true;
    dragState.current.offsetX = e.clientX - rect.left;
    dragState.current.offsetY = e.clientY - rect.top;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Markdown guide"
      className="fixed z-50 shadow-lg border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col overflow-hidden"
      style={{ left: pos.x, top: pos.y, width: 520, height: "70vh" }}
    >
      <div
        ref={headerRef}
        onMouseDown={onMouseDownHeader}
        className="cursor-grab active:cursor-grabbing select-none flex items-center justify-between gap-2 px-3 py-2 border-b bg-muted/60"
      >
        <h2 className="text-sm font-medium">Guide</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close guide"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto bg-background p-3">
        <div className="rounded-md border bg-background/40 p-3">
          <MarkdownPreview content={guideMarkdown} className="text-sm" />
        </div>
      </div>
    </div>
  );
}

export default GuideDrawer;