import { IpcMainInvokeEvent } from "electron";

export interface AppSettings {
  theme?: string;
}

export type NativeAPIHandler = (
  event: IpcMainInvokeEvent,
  ...args: any[]
) => any;
