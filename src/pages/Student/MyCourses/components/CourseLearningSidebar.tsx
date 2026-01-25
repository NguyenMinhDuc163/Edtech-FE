import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaPlayCircle,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import type {
  AdaptiveStatus,
  CourseContent,
  CourseSection,
} from "../libs/interface/courseDetail";
import "../style/CourseLearningSidebar.css";
import { useEffect, useState } from "react";
import { learningApi } from "@/services/Course/learningService";

interface SidebarProps {
  courseId: string;
  sections: CourseSection[];
  activeContent: CourseContent | null;
  expandedSections: Record<string, boolean>;
  toggleSection: (id: string) => void;
  onSelectLesson: (lesson: CourseContent) => void;
  refreshKey: number;
}

export default function CourseLearningSidebar({
  courseId,
  sections,
  activeContent,
  expandedSections,
  toggleSection,
  onSelectLesson,
  refreshKey,
}: SidebarProps) {
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await learningApi.getCourseProgress(courseId);
        const map: Record<string, any> = {};
        if (res.data?.lessons) {
          res.data.lessons.forEach((l: any) => {
            map[l.contentId] = l;
          });
        }
        setProgressMap(map);
      } catch (error) {
        console.error("Sidebar progress fetch error", error);
      }
    };
    fetchProgress();
  }, [courseId, refreshKey]);

  const getAdaptiveIcon = (status: AdaptiveStatus) => {
    switch (status) {
      case "MASTERED":
        return (
          <FaCheckCircle
            className="status-icon mastered"
            title="Đã thành thạo"
          />
        );
      case "WARNING":
        return (
          <FaExclamationTriangle
            className="status-icon warning"
            title="Cần ôn tập"
          />
        );
      case "RECOMMENDED":
        return (
          <FaStar className="status-icon recommended" title="Đề xuất học" />
        );
      default:
        return null;
    }
  };

  return (
    <aside className="learning-sidebar">
      <div className="sidebar-header">
        <h3>Nội dung khóa học</h3>
      </div>
      <div className="sidebar-scrollable">
        {sections.map((section) => (
          <div key={section.sectionId} className="sidebar-section">
            <div
              className="section-trigger"
              onClick={() => toggleSection(section.sectionId)}
            >
              <span className="section-name">
                Phần {section.orderIndex}: {section.title}
              </span>
              {expandedSections[section.sectionId] ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </div>

            {expandedSections[section.sectionId] && (
              <div className="section-lessons-list">
                {section.contents.map((lesson) => {
                  const isActive =
                    activeContent?.content_id === lesson.content_id;
                  const fileType = lesson.files?.[0]?.fileType;

                  const progressInfo = progressMap[lesson.content_id];
                  const percent = progressInfo?.progressPercent || 0;
                  const isCompleted = progressInfo?.isCompleted || false;

                  return (
                    <div
                      key={lesson.content_id}
                      className={`lesson-row ${
                        isActive ? "active" : ""
                      } ${lesson.adaptive_status.toLowerCase()}`}
                      onClick={() => onSelectLesson(lesson)}
                    >
                      <div className="lesson-left-col">
                        <span className="file-type-icon">
                          {fileType === "video" ? (
                            <FaPlayCircle />
                          ) : (
                            <FaFileAlt />
                          )}
                        </span>

                        <div className="lesson-info-col">
                          <span className="lesson-name-text">
                            {lesson.title}
                          </span>
                          {!isCompleted && percent > 0 && (
                            <div className="cls-progress-track">
                              <div
                                className="cls-progress-fill"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="lesson-right-col">
                        {getAdaptiveIcon(lesson.adaptive_status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
