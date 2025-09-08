import { app } from "electron";
import * as path from "path";
import * as fs from "fs";
import { NativeAPIHandler } from "../types";

// Params: { extension?: string; dataUrl: string }
// Returns: { filePath: string; markdownPath: string }
const saveImage: NativeAPIHandler = (_e, params: any) => {
    const { dataUrl, extension = "png" } = params || {};
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
        throw new Error("Invalid dataUrl for image");
    }
    const match = dataUrl.match(/^data:(.+?);base64,(.*)$/);
    if (!match) throw new Error("Malformed data URL");
    const mime = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, "base64");
    const safeExt = extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "png";
    const userDataPath = app.getPath("userData");
    const imagesDir = path.join(userDataPath, "images");
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
    const fileName = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const filePath = path.join(imagesDir, fileName);
    fs.writeFileSync(filePath, buffer);
    // For markdown we can reference a relative token; front-end could translate later if needed
    return { filePath, markdownPath: filePath };
};

export default saveImage;
