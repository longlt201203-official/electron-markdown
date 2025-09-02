import { app } from "electron";
import { NativeAPIHandler } from "../types";
import * as path from "path";
import * as fs from "fs";

const saveDocumentsJson: NativeAPIHandler = (e, documentJson) => {
    const userDataPath = app.getPath('userData');
    const documentsPath = path.join(userDataPath, 'documents.json');
    fs.writeFileSync(documentsPath, JSON.stringify(documentJson));
}

export default saveDocumentsJson;