import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import "./AdminSystemParameters.css";
import { systemParameterService } from "@/services/SystemParameter/systemParameterService";
import type { SystemParameter, SystemParameterFilterParams, ParameterInput } from "@/types/SystemParameter/systemParameter.type";
import { useLoadingStore } from "@/store/loadingStore";
import { useToast } from "@/components/Notification/common/ToastProvider";
import ParameterModal from "./components/ParameterModal";

export default function AdminSystemParameters() {
  const { showToast } = useToast();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [parameters, setParameters] = useState<SystemParameter[]>([]);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<SystemParameterFilterParams>({
    page: 1,
    limit: 10,
  });

  const [tempSearch, setTempSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingParameters, setEditingParameters] = useState<SystemParameter[]>([]);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const response = await systemParameterService.getSystemParameters(filters);
      setParameters(response.data.data);
      setTotal(response.total);
    } catch (err: any) {
      console.error("Load system parameters error:", err);
      showToast(err.response?.data?.message || "Tải tham số hệ thống thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, [filters]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: tempSearch || undefined,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(parameters.map((p) => p.param_id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingParameters([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    const selected = parameters.filter((p) => selectedIds.includes(p.param_id));
    setModalMode("edit");
    setEditingParameters(selected);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingParameters([]);
  };

  const handleCreate = async (params: ParameterInput[]) => {
    try {
      setLoading(true);
      await systemParameterService.createParameters({ parameters: params });
      showToast("Tạo tham số thành công", "success");
      setIsModalOpen(false);
      fetchParameters();
    } catch (err: any) {
      console.error("Create parameters error:", err);
      showToast(err.response?.data?.message || "Tạo tham số thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (params: ParameterInput[]) => {
    try {
      setLoading(true);
      const updateData = params.map((p, idx) => ({
        param_id: editingParameters[idx].param_id,
        ...p,
      }));
      await systemParameterService.updateParameters({ parameters: updateData });
      showToast("Cập nhật tham số thành công", "success");
      setIsModalOpen(false);
      setSelectedIds([]);
      fetchParameters();
    } catch (err: any) {
      console.error("Update parameters error:", err);
      showToast(err.response?.data?.message || "Cập nhật tham số thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitModal = (params: ParameterInput[]) => {
    if (modalMode === "create") {
      handleCreate(params);
    } else {
      handleUpdate(params);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa ${selectedIds.length} tham số đã chọn?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await systemParameterService.deleteParameters({ param_ids: selectedIds });
      showToast("Xóa tham số thành công", "success");
      setSelectedIds([]);
      fetchParameters();
    } catch (err: any) {
      console.error("Delete parameters error:", err);
      showToast(err.response?.data?.message || "Xóa tham số thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / (filters.limit || 10));

  return (
    <div className="system-params-page">
      <div className="system-params-header">
        <h1 className="system-params-title">Tham số hệ thống</h1>
      </div>

      <div className="system-params-actions">
        <button onClick={handleOpenCreateModal} className="system-params-btn system-params-btn-create">
          <Plus size={18} />
          Thêm mới
        </button>
        <button
          onClick={handleOpenEditModal}
          disabled={selectedIds.length === 0}
          className="system-params-btn system-params-btn-edit"
        >
          <Edit size={18} />
          Sửa ({selectedIds.length})
        </button>
        <button
          onClick={handleDelete}
          disabled={selectedIds.length === 0}
          className="system-params-btn system-params-btn-delete"
        >
          <Trash2 size={18} />
          Xóa ({selectedIds.length})
        </button>
      </div>

      <div className="system-params-filter-section">
        <div className="system-params-search-input-wrapper">
          <Search size={18} className="system-params-search-icon" />
          <input
            type="text"
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Tìm kiếm theo key hoặc mô tả (nhấn Enter)..."
            className="system-params-search-input"
          />
        </div>
      </div>

      <div className="system-params-table-container">
        <table className="system-params-table">
          <thead>
            <tr>
              <th className="system-params-checkbox-col">
                <input
                  type="checkbox"
                  checked={parameters.length > 0 && selectedIds.length === parameters.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>STT</th>
              <th>Key</th>
              <th>Value</th>
              <th>Mô tả</th>
              <th>Chức năng</th>
              <th>Cập nhật lúc</th>
            </tr>
          </thead>
          <tbody>
            {parameters.length === 0 ? (
              <tr>
                <td colSpan={7} className="system-params-empty-message">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              parameters.map((param, index) => (
                <tr key={param.param_id}>
                  <td className="system-params-checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(param.param_id)}
                      onChange={(e) => handleSelectOne(param.param_id, e.target.checked)}
                    />
                  </td>
                  <td className="system-params-stt">
                    {(filters.page! - 1) * filters.limit! + index + 1}
                  </td>
                  <td>
                    <div className="system-params-key">{param.param_key}</div>
                  </td>
                  <td>
                    <div className="system-params-value">{param.param_value}</div>
                  </td>
                  <td>
                    <div className="system-params-desc">{param.description}</div>
                  </td>
                  <td>
                    <div className="system-params-function">{param.function_name}</div>
                  </td>
                  <td className="system-params-date">{formatDate(param.updated_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="system-params-pagination">
          <button
            className="system-params-pagination-btn"
            onClick={() => handlePageChange(filters.page! - 1)}
            disabled={filters.page === 1}
          >
            Trước
          </button>
          <span className="system-params-pagination-info">
            Trang {filters.page} / {totalPages}
          </span>
          <button
            className="system-params-pagination-btn"
            onClick={() => handlePageChange(filters.page! + 1)}
            disabled={filters.page === totalPages}
          >
            Sau
          </button>
        </div>
      )}

      <ParameterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        editingParameters={editingParameters}
        mode={modalMode}
      />
    </div>
  );
}
