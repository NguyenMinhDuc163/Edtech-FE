import { useEffect, useState } from "react";
import "./style/AdminUsers.css";
import { teacherService } from "@/services/User/teacherService";
import type { User } from "@/types/User/users.type";
import TeacherList from "./components/TeacherList";
import CreateUserModal from "./components/CreateUserModal";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { useLoadingStore } from "@/store/loadingStore";

export default function AdminUsers() {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<User[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getTeachers();
      setTeachers(data);
    } catch (err) {
      console.error("Load teachers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCreateSuccess = () => {
    fetchTeachers();
  };

  const handleDeleteClick = (userId: string) => {
    setDeleteConfirm({ open: true, userId });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, userId: null });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.userId) return;

    try {
      const message = await teacherService.deleteUser(deleteConfirm.userId);
      showToast(message, "success");
      fetchTeachers();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Xóa người dùng thất bại", "error");
    } finally {
      setDeleteConfirm({ open: false, userId: null });
    }
  };

  return (
    <div className="admin-teacher-page">
      <div className="admin-teacher-container">
        <header className="admin-teacher-header">
          <h2 className="admin-teacher-title">Danh sách giáo viên</h2>

          <div className="admin-teacher-actions">
            <button className="admin-btn admin-btn-primary" onClick={handleCreate}>
              Thêm mới
            </button>
            <button className="admin-btn" onClick={() => fetchTeachers()}>
              Làm mới
            </button>
          </div>
        </header>

        <section className="admin-teacher-list-section">
          <TeacherList teachers={teachers} onDelete={handleDeleteClick} />
        </section>
      </div>

      <CreateUserModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleCreateSuccess}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
