"use client";
import { useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import JSZip from "jszip";

export default function CodeTabs({ jsx, css }) {
  const [tab, setTab] = useState('jsx');

  function copyCode() {
    navigator.clipboard.writeText(tab === 'jsx' ? jsx : css);
  }

  async function downloadZip() {
    const zip = new JSZip();
    zip.file("Component.jsx", jsx);
    zip.file("styles.css", css);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={() => setTab('jsx')} style={{ fontWeight: tab === 'jsx' ? 'bold' : undefined }}>JSX</button>
        <button onClick={() => setTab('css')} style={{ fontWeight: tab === 'css' ? 'bold' : undefined }}>CSS</button>
        <button onClick={copyCode}>Copy</button>
        <button onClick={downloadZip}>Download .zip</button>
      </div>
      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, overflowX: 'auto' }}>
        <code
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(tab === 'jsx' ? jsx : css, Prism.languages[tab === 'jsx' ? 'jsx' : 'css'], tab)
          }}
        />
      </pre>
    </div>
  );
} 