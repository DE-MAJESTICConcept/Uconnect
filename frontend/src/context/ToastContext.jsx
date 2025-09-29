import { useContext } from "react";
import { ToastContext } from "./ToastContextBase.js";

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider.");
  }
  return ctx; // { show, hide }
}
