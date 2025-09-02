import deleteDocument from "./apis/delete-document";
import listDocuments from "./apis/list-documents";
import readSettings from "./apis/read-settings";
import readStringFile from "./apis/read-string-file";
import readdir from "./apis/readdir";
import saveDocument from "./apis/save-document";
import saveSettings from "./apis/save-settings";
import sayHi from "./apis/say-hi";
import { NATIVE_API_DELETE_DOCUMENT, NATIVE_API_LIST_DOCUMENTS, NATIVE_API_READ_SETTINGS, NATIVE_API_READ_STRING_FILE, NATIVE_API_READDIR, NATIVE_API_SAVE_DOCUMENT, NATIVE_API_SAVE_SETTINGS, NATIVE_API_SAY_HI } from "./constants";
import { NativeAPIHandler } from "./types";

const nativeAPI: Record<string, NativeAPIHandler> = {
  [NATIVE_API_SAY_HI]: sayHi,
  [NATIVE_API_READDIR]: readdir,
  [NATIVE_API_READ_SETTINGS]: readSettings,
  [NATIVE_API_SAVE_SETTINGS]: saveSettings,
  [NATIVE_API_SAVE_DOCUMENT]: saveDocument,
  [NATIVE_API_LIST_DOCUMENTS]: listDocuments,
  [NATIVE_API_READ_STRING_FILE]: readStringFile,
  [NATIVE_API_DELETE_DOCUMENT]: deleteDocument
};

export default nativeAPI;
