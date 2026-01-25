import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonsBySectionService } from "@/services/Course/Lesson/lessonService";
import type { CourseContent } from "@/types/Course/course.type";
import type { CourseFile } from "@/types/Course/course_detail.type";
import ModalViewer from "@/pages/Common/Viewer/components/ModalViewer";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";
import {
  FaArrowLeft,
  FaFilePdf,
  FaVideo,
  FaFileAlt,
  FaFile,
  FaClock,
  FaLayerGroup,
} from "react-icons/fa";
import "./lesson.css";
import { formatDateTime } from "@/utils/date/formatDateTime";
import { FormattedText } from "@/utils/ui/formatText/formattext";

export default function Lesson() {
  const { sectionId } = useParams<{
    courseId: string;
    sectionId: string;
  }>();

  const navigate = useNavigate();
  const [lessons, setLessons] = useState<CourseContent[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [selectedFile, setSelectedFile] = useState<CourseFile | null>(null);
  const { showToast } = useToast();

  const fetchLessons = async () => {
    if (!sectionId) return;
    setLoading(true);
    try {
      const data = await getLessonsBySectionService(sectionId);
      setLessons(data);
    } catch (error) {
      showToast("Không thể tải danh sách bài học!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [sectionId]);

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("video"))
      return <FaVideo className="AdminLesson__Icon video" />;
    if (t.includes("pdf"))
      return <FaFilePdf className="AdminLesson__Icon pdf" />;
    if (t.includes("word") || t.includes("doc"))
      return <FaFileAlt className="AdminLesson__Icon doc" />;
    return <FaFile className="AdminLesson__Icon default" />;
  };

  return (
    <div className="AdminLesson__Container">
      <div className="AdminLesson__Header">
        <div className="AdminLesson__HeaderLeft">
          <button
            className="AdminLesson__BackBtn"
            onClick={() => navigate(-1)}
            title="Quay lại"
          >
            <FaArrowLeft />
          </button>
          <div className="AdminLesson__TitleGroup">
            <span className="AdminLesson__Label">Nội dung Chương</span>
            <h2 className="AdminLesson__Title">
              {lessons.length > 0
                ? lessons[0].sectionTitle
                : "Chi tiết Phần học"}
            </h2>
          </div>
        </div>
        <div className="AdminLesson__Meta">
          <FaLayerGroup /> {lessons.length} bài học
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="AdminLesson__EmptyState">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
            alt="Empty"
            className="AdminLesson__EmptyImg"
          />
          <p>Chưa có bài học nào trong chương này.</p>
        </div>
      ) : (
        <div className="AdminLesson__Grid">
          {lessons.map((lesson, index) => (
            <div key={lesson.contentId} className="AdminLesson__Card">
              <div className="AdminLesson__CardHeader">
                <div className="AdminLesson__Index">#{index + 1}</div>
                <div className="AdminLesson__LessonInfo">
                  <h3 className="AdminLesson__LessonName">{lesson.title}</h3>
                  <div className="AdminLesson__Date">
                    <FaClock /> Được tạo lúc: {formatDateTime(lesson.createdAt)}
                  </div>
                </div>
              </div>

              {lesson.description && (
                <div className="AdminLesson__CardBody">
                  <FormattedText content={lesson.description} />
                </div>
              )}

              {lesson.files && lesson.files.length > 0 ? (
                <div className="AdminLesson__FilesArea">
                  <div className="AdminLesson__FilesLabel">
                    Tài liệu học tập ({lesson.files.length})
                  </div>
                  <div className="AdminLesson__FilesList">
                    {lesson.files.map((file) => (
                      <div
                        key={file.fileId}
                        className="AdminLesson__FileChip"
                        onClick={() => setSelectedFile(file as CourseFile)}
                      >
                        <div className="AdminLesson__FileIconBox">
                          {getFileIcon(file.fileType)}
                        </div>
                        <div className="AdminLesson__FileMeta">
                          <span
                            className="AdminLesson__FileName"
                            title={file.title}
                          >
                            {file.title}
                          </span>
                          <span className="AdminLesson__FileType">
                            {file.fileType.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="AdminLesson__NoFiles">
                  Không có tài liệu đính kèm
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedFile && (
        <ModalViewer
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          accessLevel={"FULL"}
        />
      )}
    </div>
  );
}
