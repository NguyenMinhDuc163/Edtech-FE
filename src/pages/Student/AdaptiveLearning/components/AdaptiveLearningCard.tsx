import React from "react";
import {
  BookOpen,
  PlayCircle,
  FileText,
  File,
  Sparkles,
  LifeBuoy,
  Bot,
  ArrowRight,
} from "lucide-react";
import "../style/AdaptiveLearningCard.css";
import type { Props } from "../libs/interface";

const ACTION_CONFIG = {
  NEXT: {
    theme: "variant-next",
    icon: Sparkles,
    defaultTitle: "Xuất sắc! Bài học nâng cao tiếp theo",
    cta: "Học bài mới ngay",
  },
  REVIEW: {
    theme: "variant-review",
    icon: BookOpen,
    defaultTitle: "Củng cố kiến thức",
    cta: "Ôn tập lại",
  },
  REMEDIAL: {
    theme: "variant-remedial",
    icon: LifeBuoy,
    defaultTitle: "Kiến thức nền tảng cần bổ sung",
    cta: "Học bài bổ trợ",
  },
};

export const AdaptiveLearningCard: React.FC<Props> = ({ data, onNavigate }) => {
  if (!data || !data.targetContent) return null;

  const { action, reason, targetContent } = data;

  const config = ACTION_CONFIG[action] || ACTION_CONFIG.REVIEW;

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="alc-file-icon video" />;
      case "pdf":
      case "document":
        return <FileText className="alc-file-icon doc" />;
      default:
        return <File className="alc-file-icon other" />;
    }
  };

  return (
    <div className={`adaptive-card ${config.theme}`}>
      <div className="alc-top-badge">
        <Bot size={16} className="alc-ai-icon" />
        <span>{config.defaultTitle}</span>
      </div>

      <div className="alc-insight-box">
        <p className="alc-reason-text">
          <strong>
            {" "}
            Để giúp bạn tiếp thu kiến thức tốt hơn, hệ thống đề xuất:
          </strong>
          {reason}
        </p>
      </div>

      <div
        className="alc-lesson-card"
        onClick={() => onNavigate(targetContent.contentId)}
      >
        <div className="alc-lesson-header">
          {targetContent.title && (
            <span className="alc-lesson-name">Bài {targetContent.title}</span>
          )}
        </div>

        {targetContent.files && targetContent.files.length > 0 && (
          <div className="alc-files-mini-list">
            {targetContent.files.slice(0, 2).map((f) => (
              <span key={f.fileId} className="alc-mini-file">
                {getFileIcon(f.fileType)} {f.filename}
              </span>
            ))}
            {targetContent.files.length > 2 && (
              <span className="alc-mini-more">...</span>
            )}
          </div>
        )}

        <div className="alc-lesson-cta">
          <span>{config.cta}</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};
