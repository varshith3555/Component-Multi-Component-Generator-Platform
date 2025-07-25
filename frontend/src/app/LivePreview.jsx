"use client";
import { useEffect, useRef } from "react";

export default function LivePreview({ jsx, css }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><style>${css || ""}</style></head><body>${jsx || ""}</body></html>`);
    doc.close();
  }, [jsx, css]);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: "100%", height: "100%", border: "none", background: "white" }}
      sandbox="allow-scripts allow-same-origin"
      title="Live Preview"
    />
  );
} 