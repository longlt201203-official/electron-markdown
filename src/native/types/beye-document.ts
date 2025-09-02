
export interface BeyeDocumentRef {
  type: string;
  value: string;
}

export interface BeyeDocument {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  ref: BeyeDocumentRef;
}

export interface DocumentsJsonType {
  currentId: number;
  documents: BeyeDocument[];
}

export interface SaveDocumentParams {
    title: string;
    content: string;
    id?: number;
}