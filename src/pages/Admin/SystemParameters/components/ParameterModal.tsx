import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { SystemParameter, ParameterInput } from "@/types/SystemParameter/systemParameter.type";
import "./ParameterModal.css";

interface ParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (parameters: ParameterInput[]) => void;
  editingParameters?: SystemParameter[];
  mode: "create" | "edit";
}

export default function ParameterModal({ isOpen, onClose, onSubmit, editingParameters, mode }: ParameterModalProps) {
  const [formData, setFormData] = useState<ParameterInput[]>([
    { param_key: "", param_value: "", description: "", function_name: "" },
  ]);

  useEffect(() => {
    if (mode === "edit" && editingParameters && editingParameters.length > 0) {
      setFormData(
        editingParameters.map((p) => ({
          param_key: p.param_key,
          param_value: p.param_value,
          description: p.description,
          function_name: p.function_name,
        }))
      );
    } else {
      setFormData([{ param_key: "", param_value: "", description: "", function_name: "" }]);
    }
  }, [mode, editingParameters, isOpen]);

  const handleAddRow = () => {
    setFormData([...formData, { param_key: "", param_value: "", description: "", function_name: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    if (formData.length > 1) {
      setFormData(formData.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: keyof ParameterInput, value: string) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = formData.every((p) => p.param_key && p.param_value);
    if (!valid) {
      alert("Vui lòng điền Key và Value");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="param-modal-overlay" onClick={onClose}>
      <div className="param-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="param-modal-header">
          <h2>{mode === "create" ? "Thêm tham số mới" : "Chỉnh sửa tham số"}</h2>
          <button className="param-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="param-modal-form">
          <div className="param-modal-body">
            {formData.map((item, index) => (
              <div key={index} className="param-form-row">
                <div className="param-form-row-header">
                  <span>Tham số #{index + 1}</span>
                  {formData.length > 1 && (
                    <button type="button" onClick={() => handleRemoveRow(index)} className="param-remove-btn">
                      Xóa
                    </button>
                  )}
                </div>
                <div className="param-form-grid">
                  <div className="param-form-field">
                    <label>Key *</label>
                    <input
                      type="text"
                      value={item.param_key}
                      onChange={(e) => handleChange(index, "param_key", e.target.value)}
                      placeholder="Vui lòng nhập key"
                      required
                    />
                  </div>
                  <div className="param-form-field">
                    <label>Value *</label>
                    <input
                      type="text"
                      value={item.param_value}
                      onChange={(e) => handleChange(index, "param_value", e.target.value)}
                      placeholder="Vui lòng nhập value"
                      required
                    />
                  </div>
                  <div className="param-form-field">
                    <label>Mô tả</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleChange(index, "description", e.target.value)}
                      placeholder="Vui lòng nhập mô tả"
                    />
                  </div>
                  <div className="param-form-field">
                    <label>Chức năng</label>
                    <input
                      type="text"
                      value={item.function_name}
                      onChange={(e) => handleChange(index, "function_name", e.target.value)}
                      placeholder="Vui lòng nhập chức năng"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="param-modal-footer">
            {mode === "create" && (
              <button type="button" onClick={handleAddRow} className="param-add-row-btn">
                + Thêm dòng
              </button>
            )}
            <div className="param-modal-actions">
              <button type="button" onClick={onClose} className="param-btn-cancel">
                Hủy
              </button>
              <button type="submit" className="param-btn-submit">
                {mode === "create" ? "Tạo mới" : "Cập nhật"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
