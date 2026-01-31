import "./globals.css";

import { ToastProvider } from "@/components/common/toast/ToastProvider";
import ToastBridge from "@/components/common/toast/ToastBridge";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* App providers */}
        <ToastProvider>
          {children}
          <ToastBridge />
        </ToastProvider>

        {/* ✅ GLOBAL MODAL PORTAL ROOT */}
        <div id="modal-root" />
      </body>
    </html>
  );
}
