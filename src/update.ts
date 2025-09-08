import { updateElectronApp } from "update-electron-app";
import { BrowserWindow, ipcMain, autoUpdater } from "electron";
import { NATIVE_API_UPDATE_RESTART, NATIVE_EVENT_UPDATE_DOWNLOADED } from "./native/constants";

// Initialize auto-updates and show a friendly dialog when an update is ready
// Notify renderer with release info and let it show a custom UI
updateElectronApp({
    notifyUser: true,
    onNotifyUser: (info) => {
        const payload = {
            releaseName: info.releaseName,
            releaseNotes: info.releaseNotes,
            releaseDate: info.releaseDate?.toISOString?.() ?? "",
            updateURL: info.updateURL,
        } as const;
        BrowserWindow.getAllWindows().forEach((win) => {
            try {
            win.webContents.send(NATIVE_EVENT_UPDATE_DOWNLOADED, payload);
            } catch {
                // no-op
            }
        });
    },
});

// Allow renderer to trigger the restart/apply step
    ipcMain.handle(NATIVE_API_UPDATE_RESTART, () => {
    autoUpdater.quitAndInstall();
});