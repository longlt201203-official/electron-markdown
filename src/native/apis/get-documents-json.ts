import { app } from "electron";
import { DocumentsJsonType, NativeAPIHandler } from "../types";
import * as path from "path";
import * as fs from "fs";

const getDocumentsJson: NativeAPIHandler = (e) => {
    const userDataPath = app.getPath('userData');
    const documentsPath = path.join(userDataPath, 'documents.json');

    let data: DocumentsJsonType = {
        currentId: 0,
        documents: []
    }

    if (!fs.existsSync(documentsPath)) {
        fs.writeFileSync(documentsPath, JSON.stringify(data));
    } else {
        const fileData = fs.readFileSync(documentsPath, 'utf-8');
        data = JSON.parse(fileData);
    }

    return data;
}

export default getDocumentsJson;