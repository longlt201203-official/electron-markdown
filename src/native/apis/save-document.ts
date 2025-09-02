import {
  DocumentsJsonType,
  NativeAPIHandler,
  SaveDocumentParams,
} from "../types";
import { app } from "electron";
import * as path from "path";
import * as fs from "fs";
import getDocumentsJson from "./get-documents-json";
import saveDocumentsJson from "./save-documents-json";

function sanitizeFileName(title: string) {
  return title.replace(/[<>:"/\\|?*]+/g, "_");
}

const saveDocument: NativeAPIHandler = (
  e,
  { title, content, id }: SaveDocumentParams
) => {
  const userDataPath = app.getPath("userData");
  const documentsPath = path.join(userDataPath, "documents");
  if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath);
  }

  const sanitizedTitle = sanitizeFileName(title);
  const desiredFilePath = path.join(documentsPath, `${sanitizedTitle}.md`);

  const documentsJson: DocumentsJsonType = getDocumentsJson(e);

  console.log("Document ID:", id);

  if (!id) {
    // Create new document
    let finalFilePath = desiredFilePath;
    if (fs.existsSync(finalFilePath)) {
      // Avoid overwriting an existing file (very naive uniqueness strategy)
      const uniqueSuffix = Date.now();
      finalFilePath = path.join(
        documentsPath,
        `${sanitizedTitle}-${uniqueSuffix}.md`
      );
    }
    fs.writeFileSync(finalFilePath, content);
    documentsJson.currentId++;
    documentsJson.documents.push({
      id: documentsJson.currentId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      ref: {
        type: "file",
        value: finalFilePath,
      },
    });
  } else {
    // Update existing document
    const docIndex = documentsJson.documents.findIndex((d) => d.id == id);
    if (docIndex === -1) {
      throw new Error(`Document with id ${id} not found`);
    }
    const existing = documentsJson.documents[docIndex];
    if (existing.ref.type !== "file") {
      throw new Error("Unsupported document ref type for update");
    }
    let targetPath = existing.ref.value;
    const isTitleChanged = existing.title !== title;
    if (isTitleChanged) {
      // Compute potential new path
      let newPath = desiredFilePath;
      if (newPath !== targetPath) {
        if (fs.existsSync(newPath)) {
          // If another file already has that name, append timestamp
            const uniqueSuffix = Date.now();
            newPath = path.join(
              documentsPath,
              `${sanitizedTitle}-${uniqueSuffix}.md`
            );
        }
        // Rename existing file to new name
        try {
          fs.renameSync(targetPath, newPath);
          targetPath = newPath;
        } catch (err) {
          // Fallback: keep old path but still update contents
        }
      }
    }
    // Write new content
    fs.writeFileSync(targetPath, content);
    documentsJson.documents[docIndex] = {
      ...existing,
      title,
      updatedAt: new Date(),
      ref: { ...existing.ref, value: targetPath },
    };
  }

  saveDocumentsJson(e, documentsJson);

  return documentsJson.currentId;
};

export default saveDocument;
