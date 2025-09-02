import { NATIVE_API_LIST_DOCUMENTS } from "@/native/constants";
import { BeyeDocument } from "@/native/types"
import { createContext, PropsWithChildren, useContext, useState } from "react";

type DocumentsProviderProps = {

} & PropsWithChildren;

type DocumentsProviderState = {
    documents: BeyeDocument[];
    refetch: () => Promise<void>;
}

const DocumentsContext = createContext<DocumentsProviderState | null>(null);

export function DocumentsProvider({ children }: DocumentsProviderProps) {
    const [documents, setDocuments] = useState<BeyeDocument[]>([]);

    const refetch = async () => {
        const data = await nativeAPI.invokeNativeAPI(NATIVE_API_LIST_DOCUMENTS);
        setDocuments(data);
    };

    return <DocumentsContext.Provider value={{
        documents,
        refetch
    }}>
        {children}
    </DocumentsContext.Provider>
}

export const useDocuments = () => {
    const context = useContext(DocumentsContext);
    if (!context) {
        throw new Error("useDocuments must be used within a DocumentsProvider");
    }
    return context;
};