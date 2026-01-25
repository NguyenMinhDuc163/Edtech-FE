import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { FaExclamationTriangle } from "react-icons/fa";
import "../style/DocxPreview.css";
import { useLoadingStore } from "@/store/loadingStore";

interface DocxPreviewProps {
  url: string;
}

const DocxPreview: React.FC<DocxPreviewProps> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDocx = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`);

        const blob = await res.blob();

        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = "";

          await renderAsync(blob, containerRef.current, undefined, {
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            experimental: true,
            useBase64URL: true,
          });
        }
      } catch (err: any) {
        console.error("Error loading DOCX:", err);
        if (isMounted) {
          setError(
            "Không thể hiển thị tài liệu này. File có thể bị lỗi hoặc không tồn tại."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDocx();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div className="docx-preview-container">
      {error && (
        <div className="docx-error-state">
          <FaExclamationTriangle className="error-icon" />
          <p>{error}</p>
        </div>
      )}

      <div className={`docx-content-wrapper`} ref={containerRef} />
    </div>
  );
};

export default DocxPreview;
