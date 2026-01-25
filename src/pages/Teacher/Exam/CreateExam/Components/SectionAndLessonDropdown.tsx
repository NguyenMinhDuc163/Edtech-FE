import React, { useEffect, useState } from "react";
import { getTeacherCourseDetail } from "@/services/Course/getTeacherCourseDetailService";
import "../style/SectionAndLessonDropdown.css";

interface Lesson {
  lessonId: string;
  title: string;
}

interface Section {
  sectionId: string;
  title: string;
  lessons: Lesson[];
}

interface Props {
  courseId: string;
  selectedLesson: Lesson | null;
  setSelectedLesson: (val: Lesson | null) => void;
}

export const SectionAndLessonDropdown: React.FC<Props> = ({
  courseId,
  selectedLesson,
  setSelectedLesson,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

  useEffect(() => {
    if (!courseId) return;

    const fetchSections = async () => {
      try {
        const courseData = await getTeacherCourseDetail(courseId);
        if (courseData?.sections) {
          const mappedSections = courseData.sections.map((s: any) => ({
            sectionId: s.sectionId,
            title: s.title,
            lessons: s.lessons || [],
          }));
          setSections(mappedSections);
        } else {
          setSections([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sections:", error);
      }
    };

    fetchSections();
  }, [courseId]);

  const selectedSection = sections.find((s) => s.sectionId === selectedSectionId);

  return (
    <div className="section-lesson-dropdown">
      <div className="dropdown-group">
        <label className="dropdown-label">Chọn phần trong khóa học:</label>
        <select
          value={selectedSectionId}
          onChange={(e) => {
            const sectionId = e.target.value;
            setSelectedSectionId(sectionId);
            setSelectedLesson(null);
          }}
          className="dropdown-select"
        >
          <option value="">-- Chọn phần --</option>
          {sections.map((s) => (
            <option key={s.sectionId} value={s.sectionId}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {selectedSection && (
        <div className="dropdown-group">
          <label className="dropdown-label">Chọn bài học:</label>
          <select
            value={selectedLesson?.lessonId || ""}
            onChange={(e) => {
              const lessonId = e.target.value;
              const lesson =
                selectedSection.lessons.find((l) => l.lessonId === lessonId) ||
                null;
              setSelectedLesson(lesson);
            }}
            className="dropdown-select"
          >
            <option value="">-- Chọn bài học --</option>
            {selectedSection.lessons.map((lesson) => (
              <option key={lesson.lessonId} value={lesson.lessonId}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
