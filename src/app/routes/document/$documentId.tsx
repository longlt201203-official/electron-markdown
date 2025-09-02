import { useDocuments } from '@/app/components/documents-provider';
import { NATIVE_API_READ_STRING_FILE } from '@/native/constants';
import { BeyeDocument } from '@/native/types';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import MarkdownPreview from '../../components/markdown-preview';
import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';
import { EditIcon } from 'lucide-react';

export const Route = createFileRoute('/document/$documentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { documentId } = Route.useParams();
  const { documents } = useDocuments();
  const [document, setDocument] = useState<BeyeDocument>();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchContent = async (document: BeyeDocument) => {
    try {
      setIsLoading(true);
      setError(null);
      const content = await nativeAPI.invokeNativeAPI(
        NATIVE_API_READ_STRING_FILE,
        document.ref.value
      );
      setContent(content);
    } catch (e: any) {
      setError(e?.message || 'Failed to load document');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const found = documents.find((doc) => doc.id.toString() === documentId);
    setDocument(found);
    if (found) {
      fetchContent(found);
    } else {
      setContent("");
    }
  }, [documentId, documents]);

  if (!document) {
    return <div className="text-muted-foreground">Document not found</div>;
  }

  return (
    <div className="flex flex-col h-full gap-y-4 overflow-hidden">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          {document.title}
        </h1>
        <div className="text-xs text-muted-foreground flex gap-x-2">
          <span>ID: {document.id}</span>
        </div>
        <div className="mt-2">
          <Button size="sm" onClick={() => navigate({ to: '/editor/{-$documentId}', params: { documentId: document.id.toString() } })}>
            <EditIcon className='size-3' /> Edit
          </Button>
        </div>
      </div>
      <Separator />
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto border rounded-md p-2">
        <MarkdownPreview
          content={isLoading ? "" : content}
          className="px-1"
          emptyPlaceholder={
            isLoading ? (
              <span className="text-muted-foreground">Loading…</span>
            ) : (
              <span className="text-muted-foreground">Empty document</span>
            )
          }
        />
      </div>
    </div>
  );
}
