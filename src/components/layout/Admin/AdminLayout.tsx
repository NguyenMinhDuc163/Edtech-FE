import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, LogOut, ClipboardCheck, History, Settings, Smartphone, SlidersHorizontal } from "lucide-react";
import "./AdminLayout.css";
import { useHandleLogout } from "@/hooks/useLogOut";

export default function AdminLayout() {
  const handleLogout = useHandleLogout();
  return (
    <div className="admin-home-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2 className="admin-logo">Admin Panel</h2>
        </div>

        <nav className="admin-sidebar-menu">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={18} /> <span>Thống kê</span>
          </NavLink>

          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
          >
            <BookOpen size={18} /> <span>Khóa học</span>
          </NavLink>


          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
          >
            <Users size={18} /> <span>Người dùng</span>
          </NavLink>

          <NavLink
            to="/admin/refunds"
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
          >
            <ClipboardCheck size={18} /> <span>Phê duyệt hoàn tiền</span>
          </NavLink>

          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
          >
            <History size={18} /> <span>Lịch sử thanh toán</span>
          </NavLink>

          <NavLink
            to="/admin/course-configuration"
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
          >
            <SlidersHorizontal size={18} /> <span>Cấu hình khóa học</span>
          </NavLink>

          <NavLink
            to="/admin/iap-products"
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
          >
            <Smartphone size={18} /> <span>Sản phẩm IAP</span>
          </NavLink>

          <NavLink
            to="/admin/system-parameters"
            className={({ isActive }) =>
              `admin-menu-item ${isActive ? "active" : ""}`
            }
          >
            <Settings size={18} /> <span>Tham số hệ thống</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}
