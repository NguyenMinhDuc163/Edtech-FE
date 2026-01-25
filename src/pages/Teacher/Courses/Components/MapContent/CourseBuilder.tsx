import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaFolderOpen,
  FaPlayCircle,
  FaChevronRight,
  FaChalkboardTeacher,
  FaClock,
  FaProjectDiagram,
} from "react-icons/fa";
import {
  contentMappingService,
  type ContentItem,
} from "@/services/Course/mappingService";
import { useToast } from "@/components/Notification/common/ToastProvider";
import ContentRelationDrawer from "./components/ContentRelationDrawer";
import "./style/CourseBuilder.css";
import CourseGraphModal from "./components/CourseGraphModal";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

interface SectionGroup {
  sectionId: string;
  sectionTitle: string;
  lessons: ContentItem[];
}

const CourseBuilderPage = () => {
  const { courseId } = useParams<{ courseId: string }>(); 
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [sections, setSections] = useState<SectionGroup[]>([]);
  const [allLessons, setAllLessons] = useState<ContentItem[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [graphData, setGraphData] = useState<{
    lessons: any[];
    relations: any[];
  }>({ lessons: [], relations: [] });
  const [_isGraphLoading, setIsGraphLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseData(courseId);
    }
  }, [courseId]);

  const fetchCourseData = async (id: string) => {
    try {
      setLoading(true);
      const res = await contentMappingService.getCourseContents(id);
      console.log(res);
      const rawContents: ContentItem[] = res.contents || [];

      const indexedLessons = rawContents.map((item, index) => ({
        ...item,
        id: item.contentId, 
        globalIndex: index,
      }));
      setAllLessons(indexedLessons);
      setCourseInfo(res.courseInfo);

      const groupedSections: SectionGroup[] = [];
      const sectionMap = new Map<string, SectionGroup>();

      indexedLessons.forEach((lesson) => {
        if (!sectionMap.has(lesson.sectionId)) {
          const newSection = {
            sectionId: lesson.sectionId,
            sectionTitle: lesson.sectionTitle,
            lessons: [],
          };
          sectionMap.set(lesson.sectionId, newSection);
          groupedSections.push(newSection); 
        }
        sectionMap.get(lesson.sectionId)?.lessons.push(lesson);
      });

      setSections(groupedSections);
    } catch (error) {
      console.error(error);
      showToast("Không thể tải nội dung khóa học", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson: ContentItem) => {
    setSelectedLesson({
      id: lesson.contentId,
      title: lesson.title,
      globalIndex: lesson.globalIndex,
    });
    setIsDrawerOpen(true);
  };

  const handleOpenGraph = async () => {
    if (!courseId) return;
    
    setIsGraphOpen(true); 
    setIsGraphLoading(true);

    try {
      const res = await contentMappingService.getCourseGraph(courseId);
      
      const mappedLessons = res.allLessons.map(l => ({
        id: l.id,
        title: l.title,
        section_id: l.sectionId 
      }));

      setGraphData({
        lessons: mappedLessons,
        relations: res.allRelations 
      });

    } catch (error) {
      console.error("Lỗi tải sơ đồ khóa học", error);
      showToast("Không thể tải sơ đồ khóa học", "error");
      setIsGraphOpen(false);
    } finally {
      setIsGraphLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cb-loading-container">
        <div className="cb-spinner"></div>
      </div>
    );
  }

  return (
    <div className="course-builder-page">
      <div className="course-builder-container">
        <div className="cb-header">
          <div>
            <h1 className="cb-header__title">Xây dựng lộ trình khóa học</h1>
            {courseInfo && (
              <div className="cb-header__meta">
                <span className="cb-header__meta-item">
                  <FaChalkboardTeacher /> {courseInfo.teacher}
                </span>
                <span className="cb-header__meta-item">
                  <FaClock /> {courseInfo.courseDuration} phút
                </span>
              </div>
            )}
          </div>
          <button
          onClick={handleOpenGraph}
          className="cb-btn-preview"
        >
          <FaProjectDiagram />
          Xem sơ đồ tổng quan
        </button>
        </div>

        <div className="cb-content-list">
          {sections.length === 0 ? (
            <div className="cb-empty-state">Khóa học chưa có bài học nào.</div>
          ) : (
            sections.map((section) => (
              <div key={section.sectionId} className="cb-section">
                <div className="cb-section__header">
                  <FaFolderOpen className="cb-section__icon" />
                  {section.sectionTitle}
                </div>

                {/* Lesson List */}
                <div className="cb-lesson-group">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.contentId}
                      onClick={() => handleLessonClick(lesson)}
                      className="cb-lesson-item"
                    >
                      <div className="cb-lesson-info">
                        <div className="cb-lesson-icon-wrapper">
                          {/* Logic hiển thị icon dựa trên fileType nếu cần, mặc định video */}
                          <FaPlayCircle className="cb-lesson-icon" />
                        </div>
                        <div className="cb-lesson-details">
                          <span className="cb-lesson-title">
                            {lesson.title}
                          </span>
                          <span className="cb-lesson-subtitle">
                            {lesson.files.length > 0
                              ? `${lesson.files.length} tài liệu đính kèm`
                              : "Chưa có tài liệu"}
                          </span>
                        </div>
                      </div>

                      {/* Action Hint */}
                      <div className="cb-action-badge">
                        Cấu hình quan hệ <FaChevronRight size={10} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ContentRelationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentLesson={selectedLesson}
        allLessons={allLessons.map((l) => ({
          id: l.contentId,
          title: l.title,
          globalIndex: l.globalIndex || 0,
        }))}
      />

      <CourseGraphModal
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
        lessons={graphData.lessons}
        relations={graphData.relations}
        courseTitle={`Sơ đồ khóa học #${courseId}`}
      />
      <FloatingBackButton/>
    </div>
  );
};

export default CourseBuilderPage;
