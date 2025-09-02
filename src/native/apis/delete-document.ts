import { NativeAPIHandler, DocumentsJsonType } from "../types";
import getDocumentsJson from "./get-documents-json";
import saveDocumentsJson from "./save-documents-json";
import * as fs from "fs";

const deleteDocument: NativeAPIHandler = (e, documentId: number) => {
	if (typeof documentId !== "number") {
		throw new Error("Document id must be a number");
	}

	const documentsJson: DocumentsJsonType = getDocumentsJson(e);
	const idx = documentsJson.documents.findIndex((d) => d.id === documentId);
	if (idx === -1) {
		throw new Error(`Document with id ${documentId} not found`);
	}

	const doc = documentsJson.documents[idx];
	// Remove from array first
	documentsJson.documents.splice(idx, 1);

	// Attempt to delete the file if it exists and is a file ref
	if (doc.ref?.type === "file" && typeof doc.ref.value === "string") {
		try {
			if (fs.existsSync(doc.ref.value)) {
				fs.unlinkSync(doc.ref.value);
			}
		} catch (err) {
			// Swallow file deletion errors; logical deletion already applied.
		}
	}

	saveDocumentsJson(e, documentsJson);
	return { success: true };
};

export default deleteDocument;