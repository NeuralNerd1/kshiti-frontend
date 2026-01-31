"use client";

import { useEffect, useRef } from "react";

interface Props {
  url: string;
  onCancel: () => void;
  onCaptured: (data: {
    page_url: string;
    locators: {
      selector_type: string;
      selector_value: string;
    }[];
  }) => void;
}

export default function CaptureBrowserModal({
  url,
  onCancel,
  onCaptured,
}: Props) {
  const popupRef = useRef<Window | null>(null);

  /* ----------------------------
     OPEN POPUP
  ----------------------------- */
  useEffect(() => {
    const popup = window.open(
      url,
      "element-capture",
      "width=1400,height=900"
    );

    if (!popup) {
      alert("Popup blocked. Please allow popups.");
      onCancel();
      return;
    }

    popupRef.current = popup;

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "ELEMENT_CAPTURED") {
        onCaptured({
          page_url: url,
          locators: event.data.payload.locators,
        });

        popup.close();
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
      popup.close();
    };
  }, [url, onCaptured, onCancel]);

  /* ----------------------------
     START CAPTURE
  ----------------------------- */
  const startCapture = () => {
    const popup = popupRef.current;
    if (!popup) return;

    try {
      const script =
        popup.document.createElement("script");
      script.src = "/capture/injector.js";
      popup.document.body.appendChild(script);
    } catch {
      alert(
        "This site blocks script injection.\nCapture may not be possible here."
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Element Capture</h2>

        <p>
          Page opened in a new window.
          <br />
          Click <b>Start Capture</b> and
          select an element.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 16,
          }}
        >
          <button
            className="btn-primary"
            onClick={startCapture}
          >
            Start Capture
          </button>

          <button
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
