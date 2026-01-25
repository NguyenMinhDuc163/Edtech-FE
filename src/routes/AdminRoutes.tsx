import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import CourseApprove from "@/pages/Admin/Courses/CourseApprove/CourseApprove";
import AdminCourseApproveDetail from "@/pages/Admin/Courses/components/ApprovalCourseDetail/ApprovalCourseDetail";
import AdminLeaderboardPage from "@/pages/Admin/Courses/CourseLeaderboard/AdminLeaderboardPage";
import AdminCourses from "@/pages/Admin/Courses/CourseList/AdminCourses";
import AdminCourseDetail from "@/pages/Admin/Courses/CourseDetail/AdminCourseDetail";
import AdminLayout from "@/components/layout/Admin/AdminLayout";
import DashboardPage from "@/pages/Admin/Home/AdminDashboard";
import AdminCourseStats from "@/pages/Admin/Courses/CourseStats/AdminCourseStats";
import PendingChange from "@/pages/Admin/Courses/components/Pendingchange/PendingChange";
import NotFound from "@/pages/NotFound/components/NotFound";
import Lesson from "@/pages/Admin/Courses/components/LessonOfSection/lesson";
import AdminUsers from "@/pages/Admin/Users/AdminUsers";
import AdminRefunds from "@/pages/Admin/Refunds/AdminRefunds";
import AdminRefundDetail from "@/pages/Admin/Refunds/AdminRefundDetail";
import AdminPaymentHistory from "@/pages/Admin/Payments/AdminPaymentHistory";
import AdminPaymentDetail from "@/pages/Admin/Payments/AdminPaymentDetail";
import AdminSystemParameters from "@/pages/Admin/SystemParameters/AdminSystemParameters";
const AdminRoutes: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/approve" element={<CourseApprove />} />
          <Route
            path="courses/approve/:courseId"
            element={<AdminCourseApproveDetail />}
          />
          <Route path="courses/:courseId" element={<AdminCourseDetail />} />
          <Route
            path="courses/:courseId/stats"
            element={<AdminCourseStats />}
          />
          <Route
            path="courses/:courseId/leaderboard"
            element={<AdminLeaderboardPage />}
          />
          <Route path="courses/:courseId/sections/:sectionId" element={<Lesson />} />
          <Route path="courses/pending-changes" element={<PendingChange />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="refunds" element={<AdminRefunds />} />
          <Route path="refunds/:vnpRequestId" element={<AdminRefundDetail />} />
          <Route path="payments" element={<AdminPaymentHistory />} />
          <Route path="payments/:paymentId" element={<AdminPaymentDetail />} />
          <Route path="system-parameters" element={<AdminSystemParameters />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
