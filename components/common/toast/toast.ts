import type { ToastType } from "./types";

let toastHandler:
  | ((type: ToastType, message: string) => void)
  | null = null;

export function registerToastHandler(
  handler: (type: ToastType, message: string) => void
) {
  toastHandler = handler;
}

export const toast = {
  success(message: string) {
    toastHandler?.("success", message);
  },
  error(message: string) {
    toastHandler?.("error", message);
  },
  info(message: string) {
    toastHandler?.("info", message);
  },
};
