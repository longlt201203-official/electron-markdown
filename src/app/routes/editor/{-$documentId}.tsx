import { useDocuments } from "@/app/components/documents-provider";
import MarkdownPreview from "@/app/components/markdown-preview";
import { getDarkOrLightTheme, useTheme } from "@/app/components/theme-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"; // still used for delete confirmation
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/components/ui/resizable";
import { Separator } from "@/app/components/ui/separator";
import {
  NATIVE_API_READ_STRING_FILE,
  NATIVE_API_SAVE_DOCUMENT,
  NATIVE_API_DELETE_DOCUMENT,
} from "@/native/constants";
import { NATIVE_API_SAVE_IMAGE } from "@/native/constants";
import { BeyeDocument, SaveDocumentParams } from "@/native/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@monaco-editor/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useDebouncedCallback } from "@/app/hooks/use-debounced-callback";
import { toast } from "sonner";
import { FieldErrors, useForm } from "react-hook-form";
import z from "zod";
// Removed ScrollArea for preview; using plain overflow container for consistent internal scrolling

export const Route = createFileRoute("/editor/{-$documentId}")({
  component: RouteComponent,
});

function RouteComponent() {
  const { documentId } = Route.useParams();
  const { theme } = useTheme();
  const form = useForm<SaveDocumentParams>({
    // Include optional id in schema so it isn't stripped by zodResolver (was causing id to be undefined on submit)
    resolver: zodResolver(
      z.object({
        id: z.number().optional(),
        title: z
          .string()
          .min(2, "Title must be at least 2 characters long")
          .max(100, "Title must be at most 100 characters long"),
        content: z
          .string()
          .min(2, "Content must be at least 2 characters long")
          .max(10000, "Content must be at most 10,000 characters long"),
      })
    ),
    defaultValues: { id: undefined, title: "", content: "" },
  });
  const { refetch: refetchDocuments, documents } = useDocuments();
  // Removed error dialog state; using toast notifications instead
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const fetchContent = async (document: BeyeDocument) => {
    try {
      const content = await nativeAPI.invokeNativeAPI(
        NATIVE_API_READ_STRING_FILE,
        document.ref.value
      );
      form.setValue("content", content);
    } catch (e: any) {
    } finally {
    }
  };

  useEffect(() => {
    if (documentId && documents) {
      const doc = documents.find((d) => d.id.toString() === documentId);
      if (doc) {
        form.setValue("id", doc.id);
        form.setValue("title", doc.title);
        fetchContent(doc);
      }
    } else {
      // When no documentId param, prepare a fresh form for creating a new document
      form.reset({ id: undefined, title: "", content: "" });
    }
  }, [documentId, documents]);

  // Track last saved snapshot to prevent redundant auto-saves
  const lastSavedRef = useRef<string>("");

  const saveDocument = async (
    data: SaveDocumentParams,
    { silent }: { silent: boolean }
  ) => {
    setIsSaving(true);
    try {
      const newId = await nativeAPI.invokeNativeAPI(
        NATIVE_API_SAVE_DOCUMENT,
        data
      );
      const created = !data.id;
      if (created) {
        navigate({
          to: "/editor/{-$documentId}",
          params: { documentId: newId.toString() },
        });
        data.id = newId; // mutate local copy so subsequent saves know id
      }
      // Refresh list (async fire & forget)
      refetchDocuments();
      // Record snapshot
      lastSavedRef.current = JSON.stringify({
        id: data.id,
        title: data.title,
        content: data.content,
      });
      if (!silent) {
        toast.success(created ? "Document created" : "Document saved", {
          description: data.title || "Untitled",
        });
      }
    } catch (err: any) {
      if (!silent) {
        const message = err?.message || String(err) || "Unknown error";
        toast.error("Failed to save document", { description: message });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const manualSave = (d: SaveDocumentParams) =>
    saveDocument(d, { silent: false });

  const handleInvalid = (errors: FieldErrors<SaveDocumentParams>) => {
    const msgs = Object.values(errors)
      .map((e) => (e as any)?.message as string | undefined)
      .filter((m): m is string => !!m);
    if (!msgs.length) {
      toast.error("Validation failed", {
        description: "Please fix the highlighted fields.",
      });
      return;
    }
    const unique = Array.from(new Set(msgs));
    // Combine into a single toast with newline separation for clarity
    toast.error("Validation failed", {
      description: unique.join("\n"),
    });
  };

  // Debounced auto-save (2s after last content or title change)
  const debouncedAutoSave = useDebouncedCallback(() => {
    if (isSaving) return;
    const values = form.getValues();
    const snapshot = JSON.stringify({
      id: values.id,
      title: values.title,
      content: values.content,
    });
    if (snapshot === lastSavedRef.current) return; // nothing changed
    form.handleSubmit(
      (d) => saveDocument(d, { silent: true }),
      () => {}
    )();
  }, 2000);

  useEffect(() => {
    debouncedAutoSave();
  }, [form.watch("content"), form.watch("title"), debouncedAutoSave]);

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 gap-y-4 overflow-hidden">
        <div className="flex flex-col gap-y-1">
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                // Navigate to the optional-parameter-less route and reset form
                navigate({ to: ".." });
                form.reset({ id: undefined, title: "", content: "" });
              }}
            >
              New
            </Button>
            <Button
              onClick={() =>
                form.handleSubmit((d) => manualSave(d), handleInvalid)()
              }
              disabled={isSaving}
              className="ml-2"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {form.watch("id") && (
              <Button
                variant="destructive"
                className="ml-2"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteOpen(true)}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
        <Separator />
        <Input
          placeholder="Give a title..."
          className="rounded-none outline-none border-0 shadow-none focus-visible:ring-0 text-4xl! font-semibold"
          {...form.register("title")}
        />
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 min-h-0 h-full overflow-hidden"
        >
          <ResizablePanel
            defaultSize={50}
            className="flex flex-col min-h-0 h-full overflow-hidden"
          >
            <Editor
              theme={getDarkOrLightTheme(theme) === "dark" ? "vs-dark" : "vs"}
              language="markdown"
              value={form.watch("content")}
              onChange={(v) => form.setValue("content", v || "")}
              onMount={(editor, monaco) => {
                // Paste listener (example placeholder)
                const pasteDisposable = editor.onDidPaste(async (e) => {});

                // Register Ctrl/Cmd+S inside Monaco
                editor.addCommand(
                  monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                  () => form.handleSubmit((d) => manualSave(d), handleInvalid)()
                );
                editor.onDidDispose(() => {
                  pasteDisposable.dispose();
                });
              }}
              height="100%"
              options={{
                wordWrap: "on",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                formatOnPaste: true,
              }}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={50}
            className="flex flex-col min-h-0 h-full overflow-hidden"
          >
            <div className="flex-1 min-h-0 w-full overflow-y-auto">
              <div className="px-2 pb-8">
                <MarkdownPreview content={form.watch("content")} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently removes the document and its file from
              disk. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={async () => {
                const currentId = form.getValues("id");
                if (!currentId) {
                  setConfirmDeleteOpen(false);
                  return;
                }
                setIsDeleting(true);
                try {
                  const deletedTitle = form.getValues("title");
                  await nativeAPI.invokeNativeAPI(
                    NATIVE_API_DELETE_DOCUMENT,
                    currentId
                  );
                  setConfirmDeleteOpen(false);
                  await refetchDocuments();
                  form.reset({ title: "", content: "", id: undefined });
                  try {
                    form.setValue("id", undefined as any);
                  } catch {}
                  toast.success("Document deleted", {
                    description: deletedTitle || `ID ${currentId}`,
                  });
                  navigate({ to: ".." });
                } catch (err: any) {
                  toast.error("Failed to delete document", {
                    description:
                      err?.message || String(err) || "Unknown delete error",
                  });
                } finally {
                  setIsDeleting(false);
                }
              }}
              autoFocus
            >
              Confirm Delete
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Global Ctrl/Cmd+S listener (outside component scope not suitable because needs form). Left intentionally empty.

// Auto-save effect (2s debounce after user stops typing or changing title)
// Placed after component for clarity; actual logic should be inside RouteComponent but added here is non-operative.
