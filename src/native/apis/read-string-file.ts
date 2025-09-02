import { NativeAPIHandler } from "../types";
import * as fs from "fs";

const readStringFile: NativeAPIHandler = async (e, filepath) => {
    return fs.readFileSync(filepath, "utf-8");
}

export default readStringFile;