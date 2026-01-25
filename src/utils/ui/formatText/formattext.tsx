import React, { useState, useMemo } from "react";
import "./formatText.css";

interface FormattedTextProps {
  content?: string;
  className?: string;
  maxLength?: number;
}

export const FormattedText: React.FC<FormattedTextProps> = ({
  content,
  className = "",
  maxLength,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  const { textToDisplay, shouldShowButton } = useMemo(() => {
    if (!maxLength || content.length <= maxLength) {
      return { textToDisplay: content, shouldShowButton: false };
    }

    if (isExpanded) {
      return { textToDisplay: content, shouldShowButton: true };
    }

    const sliced = content.slice(0, maxLength);
    const lastSpaceIndex = sliced.lastIndexOf(" ");

    const safeText =
      lastSpaceIndex > 0 ? sliced.slice(0, lastSpaceIndex) : sliced;

    return { textToDisplay: `${safeText}...`, shouldShowButton: true };
  }, [content, maxLength, isExpanded]);

  const paragraphs = textToDisplay.split(/\r?\n/);

  return (
    <div className={`formatted-text-container ${className}`}>
      {paragraphs.map((paragraph, index) => {
        if (!paragraph.trim()) {
          return <div key={index} className="ft-spacer" />;
        }
        return (
          <p key={index} className="ft-paragraph">
            {paragraph}
          </p>
        );
      })}

      {shouldShowButton && (
        <button
          className="ft-read-more-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
};
