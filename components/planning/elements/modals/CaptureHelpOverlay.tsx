"use client";

export default function CaptureHelpOverlay() {
  return (
    <div className="capture-help-overlay">
      <div className="capture-help-box">
        <div className="capture-help-title">
          Capture mode enabled
        </div>

        <ul>
          <li>
            Hover over an element to
            highlight it
          </li>
          <li>
            Click an element to capture
            its selectors
          </li>
          <li>
            The browser will close
            automatically
          </li>
        </ul>
      </div>
    </div>
  );
}
