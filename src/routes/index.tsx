import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import StudentRoutes from "./StudentRoutes";
import TeacherRoutes from "./TeacherRoutes";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import AdminRoutes from "./AdminRoutes";
import GlobalLoading from "@/components/Loading/GlobalLoading";
import NotFound from "@/pages/NotFound/components/NotFound";
import Home from "@/pages/Common/Home/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import SearchPage from "@/pages/Common/Search/search";
import ProfilePage from "@/pages/Common/Profile/profile";
import About from "@/pages/Common/About/About";
import Teachers from "@/pages/Common/Teachers/Teachers";
import PaymentsPage from "@/pages/Student/Payments/PaymentsPage";
import PaymentInvoice from "@/pages/Student/Payments/PaymentInvoice";
import { useAuthStore } from "@/store/authStore";
import SettingsPage from "@/pages/Common/Setting/SettingsPage";

export default function AppRoutes() {
  const { pathname } = useLocation();

  const noLayoutRoutes = ["/register", "/login", "/take"];
  const isAdminRoute = pathname.startsWith("/admin");
  const shouldHideLayout =
    noLayoutRoutes.some((path) => pathname.includes(path)) || isAdminRoute;
  return (
    <>
      <GlobalLoading />

      {!shouldHideLayout && <Navbar />}

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/payments/:paymentId" element={<PaymentInvoice />} />
        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/teacher/*" element={<TeacherRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
}

const RootRedirect: React.FC = () => {
  const { userRoles, userId } = useAuthStore();

  if (!userId || !userRoles) {
    return <Home />;
  }

  const role = Array.isArray(userRoles)
    ? userRoles[0]?.toLowerCase()
    : userRoles.toLowerCase();

  switch (role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "teacher":
      return <Home />;
    case "student":
    default:
      return <Home />;
  }
};
