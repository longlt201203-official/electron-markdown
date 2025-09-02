import { NativeAPIHandler } from "../types";
import getDocumentsJson from "./get-documents-json";

const listDocuments: NativeAPIHandler = (e) => {
    const documentsJson = getDocumentsJson(e);
    return documentsJson.documents;
}

export default listDocuments;