import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userService } from "@/services/User/userService";
import { useAuthStore } from "@/store/authStore";
import { useHandleLogout } from "@/hooks/useLogOut";
import type { User } from "@/types/User/users.type";
import logoImage from "@assets/pictures/logo.png";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userRoles, setAuth } = useAuthStore();
  const handleLogout = useHandleLogout();

  const [user, setUser] = useState<User | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setUser(null);
        return;
      }
      try {
        const profile = await userService.getProfile();
        setUser(profile);
        setAuth({
          accessToken: useAuthStore.getState().accessToken!,
          refreshToken: useAuthStore.getState().refreshToken!,
          userId: profile!.id,
          userName: profile!.username,
          userRoles: profile!.role,
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchUser();
  }, [userId, setAuth]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserDropdown(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasTeacherRole = userRoles?.includes("teacher");
  const courseLink = hasTeacherRole ? "/teacher/courses" : "/student/courses";

  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-area">
          <img src={logoImage} alt="EdTech Logo" className="site-logo" />

          <span className="brand-name">EdTech</span>
        </Link>

        <div className="desktop-menu">
          <Link to="/" className={`nav-link ${isActive("/")}`}>
            Trang chủ
          </Link>
          <Link to={courseLink} className={`nav-link ${isActive(courseLink)}`}>
            Khóa học
          </Link>
          {!hasTeacherRole && (
            <Link
              to="/teachers"
              className={`nav-link ${isActive("/teachers")}`}
            >
              Giảng viên
            </Link>
          )}
          <Link to="/about" className={`nav-link ${isActive("/about")}`}>
            Về chúng tôi
          </Link>
        </div>

        <div className="action-area">
          {user ? (
            <>
              {!hasTeacherRole && (
                <Link
                  to="/student/learn"
                  className="my-learning-btn desktop-only"
                >
                  Khóa học của tôi
                </Link>
              )}

              <div className="user-profile-wrapper" ref={dropdownRef}>
                <div
                  className="user-info"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <img src={user.avatar_url} alt="avatar" className="avatar" />
                  <span className="navbar-username desktop-only">
                    {user.full_name ?? user.username}
                  </span>
                  <svg
                    className={`chevron ${showUserDropdown ? "rotate" : ""}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                <div
                  className={`dropdown-menu ${showUserDropdown ? "show" : ""}`}
                >
                  <div className="dropdown-header">
                    <p className="d-name">{user.full_name ?? user.username}</p>
                    <p className="d-role">
                      {hasTeacherRole ? "Giảng viên" : "Học viên"}
                    </p>
                  </div>
                  <hr />
                  <Link to="/profile" className="dropdown-item">
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    to="student/learn"
                    className="dropdown-item mobile-only"
                  >
                    Khóa học của tôi
                  </Link>
                  {!hasTeacherRole && (
                    <Link to="/payments" className="dropdown-item">
                      Thanh toán
                    </Link>
                  )}
                  <Link to="/settings" className="dropdown-item">
                    Cài đặt
                  </Link>
                  <hr />
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons desktop-only">
              <button className="btn-login" onClick={() => navigate("/login")}>
                Đăng nhập
              </button>

              <button
                className="btn-signup"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </div>
          )}

          <button
            className={`hamburger-btn ${isMobileMenuOpen ? "open" : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-links">
          <Link to="/" className={`mobile-link ${isActive("/")}`}>
            Trang chủ
          </Link>
          <Link
            to={courseLink}
            className={`mobile-link ${isActive(courseLink)}`}
          >
            Khóa học
          </Link>
          {!hasTeacherRole && (
            <Link
              to="/teachers"
              className={`mobile-link ${isActive("/teachers")}`}
            >
              Giảng viên
            </Link>
          )}
          <Link to="/about" className={`mobile-link ${isActive("/about")}`}>
            Về chúng tôi
          </Link>

          {!user && (
            <div className="mobile-auth">
              <button className="btn-login" onClick={() => navigate("/login")}>
                Đăng nhập
              </button>
              <button
                className="btn-signup"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
