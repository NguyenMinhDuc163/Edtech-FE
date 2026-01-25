import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { Document, Page, pdfjs } from "react-pdf";
import ReactMarkdown from "react-markdown";
import type { CourseFile } from "@/types/Course/course_detail.type";
import "../style/ModalViewer.css";
import { useLoadingStore } from "@/store/loadingStore";
import { FaSearchMinus, FaSearchPlus } from "react-icons/fa";
import DocxPreview from "./DocxPreview";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface ModalViewerProps {
  file: CourseFile;
  onClose: () => void;
  accessLevel: "FREE" | "FULL";
}

export default function ModalViewer({
  file,
  onClose,
  accessLevel,
}: ModalViewerProps) {
  const [pdfPage, setPdfPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [scale, setScale] = useState(1.0); // Zoom

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3.0)); // Max 300%
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5)); // Min 50%

  useEffect(() => {
    if (file.fileType === "pdf" || file.fileType === "document") {
      setLoading(true);
    }

    return () => setLoading(false);
  }, [file, setLoading]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setLoading(false);
  };

  const pdfOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

  const changePage = (offset: number) => {
    setPdfPage((prevPageNumber) => prevPageNumber + offset);
  };

  const renderContent = () => {
    if (!file.url && accessLevel === "FULL") {
      return (
        <div className="course-no-content">Bài giảng đang được cập nhật</div>
      );
    }
    if (!file.url) {
      return (
        <div className="course-no-content">
          Nội dung bị khóa. Vui lòng mua khóa học để xem đầy đủ.
        </div>
      );
    }

    switch (file.fileType) {
      case "video":
        return (
          <div className="course-video-wrapper">
            <ReactPlayer
              src={file.url}
              controls={true}
              width="100%"
              height="100%"
              playing={true}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload noremoteplayback", 
                      disablePictureInPicture: true,
                      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
                    },
                  },
                }}
            />
          </div>
        );

      case "pdf":
        return (
          <div className="course-pdf-container">
            <div className="pdf-document-wrapper scrollable-content">
              <Document
                file={file.url}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                error={
                  <div className="pdf-error">
                    Không thể tải tài liệu. Vui lòng thử lại sau.
                  </div>
                }
                options={pdfOptions}
              >
                <Page
                  pageNumber={pdfPage}
                  className="course-pdf-page"
                  height={window.innerHeight * 0.7}
                  scale={scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
            </div>

            {numPages && (
              <div className="course-pdf-controls">
                <div className="pdf-zoom-controls">
                  <button
                    className="pdf-btn icon-btn"
                    onClick={handleZoomOut}
                    title="Thu nhỏ"
                  >
                    <FaSearchMinus />
                  </button>
                  <span className="zoom-value">{Math.round(scale * 100)}%</span>
                  <button
                    className="pdf-btn icon-btn"
                    onClick={handleZoomIn}
                    title="Phóng to"
                  >
                    <FaSearchPlus />
                  </button>
                </div>

                <div className="pdf-divider">|</div>

                <button
                  className="pdf-btn"
                  onClick={() => changePage(-1)}
                  disabled={pdfPage <= 1}
                >
                  ❮ Trước
                </button>

                <span className="pdf-page-info">
                  Trang <strong>{pdfPage}</strong> / {numPages}
                </span>

                <button
                  className="pdf-btn"
                  onClick={() => changePage(1)}
                  disabled={pdfPage >= numPages}
                >
                  Sau ❯
                </button>
              </div>
            )}
          </div>
        );
      case "document":
        return <DocxPreview url={file.url} />;

      case "text":
        return (
          <div className="course-text-viewer">
            <ReactMarkdown>{file.title || "Nội dung văn bản"}</ReactMarkdown>
          </div>
        );

      default:
        return (
          <div className="course-no-content">
            Định dạng file không được hỗ trợ
          </div>
        );
    }
  };

  return (
    <div className="course-modal-overlay" onClick={onClose}>
      <div
        className="course-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="course-modal-header">
          <h2 className="course-modal-title">{file.title}</h2>
          <button className="course-modal-close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>

        <div className="course-modal-body">{renderContent()}</div>
      </div>
    </div>
  );
}
