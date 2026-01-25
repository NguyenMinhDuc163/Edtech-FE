import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseService } from "@/services/Course/courseService";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";
import ModalViewer from "@/pages/Common/Viewer/components/ModalViewer";
import type {
  CourseContent,
  PurchasedCourseDetail,
} from "../libs/interface/courseDetail";
import type { CourseFile } from "@/types/Course/course_detail.type";

import "../style/CourseLearning.css";
import CourseLearningSidebar from "./CourseLearningSidebar";
import CourseLearningMain from "./CourseLearningMain";
import CourseLearningHeader from "./CourseLearningHeader";
import CourseChatWidget from "@/components/Chat/CourseChatWidget";
import type { LeaderboardItem } from "../../CourseDetail/components/LeaderboardWidget";
import { studentExamService } from "@/services/Exam/Student/studentExamService";
import CourseLeaderboardModal from "./CourseLeaderboardModal";
import { useAuthStore } from "@/store/authStore";

export default function CourseLearning() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const userId = useAuthStore.getState().userId;
  const { showToast } = useToast();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [courseData, setCourseData] = useState<PurchasedCourseDetail | null>(
    null
  );
  const [activeContent, setActiveContent] = useState<CourseContent | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<CourseFile | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [lbLoading, setLbLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await courseService.getPurchasedCourseDetail(courseId);
        setCourseData(data);

        if (data.sections?.length > 0) {
          let targetLesson: CourseContent | null = null;
          const initialExpanded: Record<string, boolean> = {};

          if (data.sections[0])
            initialExpanded[data.sections[0].sectionId] = true;

          for (const sec of data.sections) {
            const found = sec.contents.find(
              (c: any) => c.adaptive_status === "RECOMMENDED"
            );
            if (found) {
              targetLesson = found;
              initialExpanded[sec.sectionId] = true;
              break;
            }
          }

          if (!targetLesson && data.sections[0]?.contents?.length > 0) {
            targetLesson = data.sections[0].contents[0];
          }

          setExpandedSections(initialExpanded);
          setActiveContent(targetLesson);
        }
      } catch (error) {
        showToast("Lỗi tải khóa học", "error");
        navigate("/student/learn");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLessonComplete = useCallback(() => {
    setSidebarRefreshKey((prev) => prev + 1);

    if (!courseData || !activeContent) return;

    let foundCurrent = false;
    let nextLesson: CourseContent | null = null;
    let nextSectionId: string | null = null;

    for (const section of courseData.sections) {
      for (const lesson of section.contents) {
        if (foundCurrent) {
          nextLesson = lesson;
          nextSectionId = section.sectionId;
          break;
        }
        if (lesson.content_id === activeContent.content_id) {
          foundCurrent = true;
        }
      }
      if (nextLesson) break;
    }

    if (nextLesson) {
      showToast(`Đã hoàn thành! Chuyển sang: ${nextLesson.title}`, "success");
      if (nextSectionId && !expandedSections[nextSectionId]) {
        setExpandedSections((prev) => ({ ...prev, [nextSectionId!]: true }));
      }
      setActiveContent(nextLesson);
    } else {
      showToast("Chúc mừng! Bạn đã hoàn thành khóa học.", "success");
    }
  }, [courseData, activeContent, expandedSections, showToast]);

  useEffect(() => {
    if (!courseId) return;

    const fetchLeaderboard = async () => {
      try {
        setLbLoading(true);
        const response = await studentExamService.getLeaderboard(courseId);
        const data = response?.leaderboard || response?.data?.leaderboard || [];
        setLeaderboardData(data);
      } catch (err) {
        showToast('Có lỗi trong quá trình lấy bảng xếp hạng', 'error');
      } finally {
        setLbLoading(false);
      }
    };

    fetchLeaderboard();
  }, [courseId]);

  const handleOpenLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!courseData) return null;

  return (
    <div
      className={`learning-layout ${
        isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      <CourseLearningHeader
        title={courseData.title}
        progress={Number(courseData.progress)}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onShowLeaderboard={handleOpenLeaderboard}
      />

      <div className="learning-workspace">
        <CourseLearningMain
          courseId={courseId!}
          content={activeContent}
          onOpenModal={setSelectedFile}
          onLessonComplete={handleLessonComplete}
        />

        <CourseLearningSidebar
          courseId={courseId!}
          sections={courseData.sections}
          activeContent={activeContent}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          onSelectLesson={setActiveContent}
          refreshKey={sidebarRefreshKey}
        />
      </div>

      {selectedFile && (
        <ModalViewer
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          accessLevel="FULL"
        />
      )}
      <CourseChatWidget
        courseId={courseId}
        contentId={activeContent?.content_id}
      />

      <CourseLeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        data={leaderboardData}
        currentStudentId={userId}
        loading={lbLoading}
      />
    </div>
  );
}
