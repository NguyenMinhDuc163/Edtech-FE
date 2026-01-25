import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import CoursesPage from "@/pages/Student/Courses/page";
import CourseDetailPage from "@/pages/Student/CourseDetail/page";
import TakeExam from "@/pages/Student/Exam/TakeExam/TakeExam";
import PreviewExam from "@/pages/Student/Exam/PreviewExam/previewExam";
import SubmitExam from "@/pages/Student/Exam/SubmitExam/SubmitExam";
import ExamListPage from "@/pages/Student/Exam/ListExam/ExamListPage";
import ExamHistory from "@/pages/Student/Exam/HistoryExam/ExamHistory";
import ExamViewPage from "@/pages/Student/Exam/ViewExam/ExamViewPage";
import ConfirmOrderPage from "@/pages/Student/Checkout/ConfirmOrderPage";
import PaymentResultPage from "@/pages/Student/Checkout/PaymentResult";
import NotFound from "@/pages/NotFound/components/NotFound";
import MyCourses from "@/pages/Student/MyCourses/components/MyCourses";
import CourseLearning from "@/pages/Student/MyCourses/components/CourseLearning";

const StudentRoutes: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <Routes>
        <Route path="courses" element={<CoursesPage />} />
        <Route path="course/:courseId" element={<CourseDetailPage />} />
        <Route path="checkout" element={<ConfirmOrderPage />} />
        <Route path="checkout/result" element={<PaymentResultPage />} />
        <Route
          path="course/:courseId/exams/:examId/take"
          element={<TakeExam />}
        />
        <Route
          path="course/:courseId/exams/:examId/preview"
          element={<PreviewExam />}
        />
        <Route
          path="course/:courseId/exams/:examId/result"
          element={<SubmitExam />}
        />
        <Route path="course/:courseId/exams" element={<ExamListPage />} />
        <Route
          path="course/:courseId/exams/:examId/history"
          element={<ExamHistory />}
        />
        <Route
          path="course/:courseId/exams/:examId/view"
          element={<ExamViewPage />}
        />
        <Route path="learn" element={<MyCourses />} />
        <Route path="learn/:courseId" element={<CourseLearning />} />
        <Route path="learn/:courseId/contents/:contentId" element={<CourseLearning />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default StudentRoutes;
