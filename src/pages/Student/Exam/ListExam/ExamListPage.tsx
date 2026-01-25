import React, { useEffect, useMemo, useState } from "react";
import "./style/ExamListPage.css";
import type { ExamListItemType } from "@/types/Exam/examList.type";
import { ExamListItem } from "./components/ExamListItem";
import { studentExamService } from "@/services/Exam/Student/studentExamService";
import {
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useLoadingStore } from "@/store/loadingStore";
import { groupExamsByStructure } from "./libs/groupData";
import SkeletonCourseList from "@/components/NotFoundData/notFound";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

const ExamListPage: React.FC = () => {
  const location = useLocation();
  const { courseId } = useParams<{ courseId: string }>();
  const courseTitleFromState = location.state?.courseTitle;
  const [searchParams] = useSearchParams();

  const sectionId = searchParams.get("sectionId") || null;
  const lessonId = searchParams.get("lessonId") || null;

  const [exams, setExams] = useState<ExamListItemType[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const loading = useLoadingStore((state) => state.isLoading);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        if (!courseId) return;
        setLoading(true);
        const payload = {
          course_id: courseId,
          section_id: sectionId ?? undefined,
          lesson_id: lessonId ?? undefined,
        };
        const data = await studentExamService.getAllExams(payload);
        if (Array.isArray(data)) setExams(data);
      } catch (err) {
        console.error("Lỗi tải đề thi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [courseId, sectionId, lessonId]);

  const groupedData = useMemo(() => groupExamsByStructure(exams), [exams]);
  const sectionKeys = Object.keys(groupedData);
  if (loading) {
    return <SkeletonCourseList count={8} />;
  }

  return (
    <div className="exam-list-container">
      <div className="exam-list-header">
        <h2>Kho đề thi khóa học {courseTitleFromState}</h2>
      </div>

      {exams.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có đề thi nào trong phạm vi tìm kiếm này.</p>
        </div>
      ) : (
        <div className="exam-grouped-list">
          {sectionKeys.map((secId) => {
            const section = groupedData[secId];
            const lessonKeys = Object.keys(section.lessons);

            return (
              <div key={secId} className="section-group-container">
                <div className="section-header-bar">
                  <h3>Chương: {section.sectionTitle}</h3>
                </div>

                <div className="section-body">
                  {lessonKeys.map((lesId) => {
                    const lesson = section.lessons[lesId];
                    return (
                      <div key={lesId} className="lesson-group-container">
                        <div className="lesson-header-bar">
                          <h4>Bài: {lesson.lessonTitle}</h4>
                        </div>

                        <div className="exam-grid-layout">
                          {lesson.exams.map((exam) => (
                            <ExamListItem key={exam.quizId} exam={exam} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <FloatingBackButton/>
    </div>
  );
};

export default ExamListPage;
