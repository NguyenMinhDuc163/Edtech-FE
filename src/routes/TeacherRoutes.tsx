import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import TeacherCoursesPage from "@/pages/Teacher/Courses/TeacherCoursesPage";
import CreateCourse from "@/pages/Teacher/Courses/Components/CreateCourse/CreateCourse";
import TeacherCourseDetail from "@/pages/Teacher/Courses/Components/TeacherCourseDetail/TeacherCourseDetail";
import SectionDetail from "@/pages/Teacher/Courses/Components/SectionDetail/SectionDetail";
import CreateExam from "@/pages/Teacher/Exam/CreateExam/CreateExam";
import TeacherPendingChanges from "@/pages/Teacher/Courses/Components/TeacherPendingChanges/TeacherPendingChanges";
import CoursePendingsHistory from "@/pages/Teacher/Courses/Components/CoursePendingsHistory/CoursePendingsHistory";
import DraftEdit from "@/pages/Teacher/Courses/Components/DraftEdit/DraftEdit";
import NotFound from "@/pages/NotFound/components/NotFound";
import { AddQuestionsPage } from "@/pages/Teacher/Exam/AddQuestion/AddQuestionsPage";
import { ExamListPage } from "@/pages/Teacher/Exam/ListExam/ExamListPage";
import { ExamDetailPage } from "@/pages/Teacher/Exam/ExamDetail/ExamDetailPage";
import AISyllabusPage from "@/pages/Teacher/Courses/Components/AISyllabusPage/AISyllabusPage";
import CourseBuilderPage from "@/pages/Teacher/Courses/Components/MapContent/CourseBuilder";

const TeacherRoutes: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
        <Routes>
          <Route path="courses" element={<TeacherCoursesPage />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/:courseId" element={<TeacherCourseDetail />} />
          <Route path="courses/:courseId/sections/:sectionId" element={<SectionDetail />} />
          <Route path="courses/:courseId/draft-edit/:draftId" element={<DraftEdit />} />
          <Route path="courses/:courseId/pendings-history" element={<CoursePendingsHistory />} />
          <Route path="courses/pending-changes" element={<TeacherPendingChanges />} />
          <Route path="courses/:courseId/exam/create" element={<CreateExam />} />
          <Route path="/courses/:courseId/exam/:examId/question" element={<AddQuestionsPage />} />
          <Route path="/courses/:courseId/exam" element={<ExamListPage />} />
          <Route path="/courses/:courseId/exam/:examId" element={<ExamDetailPage />} />
          <Route path="courses/ai-syllabus" element={<AISyllabusPage />} />
                    <Route path="courses/map/:courseId" element={<CourseBuilderPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
    </ProtectedRoute>
  );
};

export default TeacherRoutes;
