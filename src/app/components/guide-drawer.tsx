import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { CircleQuestionMarkIcon } from "lucide-react";
import MarkdownPreview from "./markdown-preview";
// Import the bundled markdown file (raw contents) via Vite.
// The ?raw suffix ensures we get a string at build time instead of attempting to parse it.
import guideMarkdown from "../../../template.md?raw";

export function GuideDrawer() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open Markdown guide">
          <CircleQuestionMarkIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] w-full sm:max-w-2xl p-4 overflow-hidden flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b">
          <h2 className="text-lg font-semibold tracking-tight">Guide</h2>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto rounded-md border bg-background/40 p-3">
          <MarkdownPreview
            content={guideMarkdown}
            className="text-sm"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default GuideDrawer;