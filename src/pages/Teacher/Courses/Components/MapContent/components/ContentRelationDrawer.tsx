import { useToast } from "@/components/Notification/common/ToastProvider";
import React, { useEffect, useState, useMemo } from "react";
import {
  FaTrash,
  FaPlus,
  FaTimes,
  FaBook,
  FaLink,
  FaFirstAid,
} from "react-icons/fa";
import "../style/ContentRelationDrawer.css";
import { contentMappingService } from "@/services/Course/mappingService";

interface LessonOption {
  id: string;
  title: string;
  globalIndex: number;
}

type RelationType = "PREREQUISITE" | "RELATED" | "REMEDIAL";

interface ContentRelationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLesson: LessonOption | null;
  allLessons: LessonOption[];
}

interface ContentInfo {
  content_id: string;
  title: string;
  description: string;
  is_preview: string;
}

interface RelationItem {
  id: string;
  relation_type: RelationType;
  parent_content_id: string;
  child_content_id: string;
  parentContent?: ContentInfo;
  childContent?: ContentInfo;
}

interface RelationsResponse {
  prerequisites: RelationItem[];
  related: RelationItem[];
  remedial: any[];
}

const ContentRelationDrawer: React.FC<ContentRelationDrawerProps> = ({
  isOpen,
  onClose,
  currentLesson,
  allLessons,
}) => {
  const { showToast } = useToast();

  const [relationsData, setRelationsData] = useState<RelationsResponse>({
    prerequisites: [],
    related: [],
    remedial: [],
  });

  const [activeTab, setActiveTab] = useState<any>("PREREQUISITE");
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentLesson) {
      fetchRelations();
    }
  }, [isOpen, currentLesson]);

  const fetchRelations = async () => {
    if (!currentLesson) return;
    setIsLoading(true);
    try {
      const res: RelationsResponse = await contentMappingService.getRelations(
        currentLesson.id
      );

      setRelationsData({
        prerequisites: res.prerequisites || [],
        related: res.related || [],
        remedial: res.remedial || [],
      });
    } catch (error) {
      showToast("Không thể tải danh sách quan hệ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const displayedRelations = useMemo(() => {
    if (activeTab === "PREREQUISITE") return relationsData.prerequisites;
    if (activeTab === "REMEDIAL") return relationsData.remedial;
    return relationsData.related;
  }, [relationsData, activeTab]);

  const availableParents = useMemo(() => {
    if (!currentLesson) return [];

    const allUsedIds = [
      ...relationsData.prerequisites.map((r) => r.parent_content_id),
      ...relationsData.related.map((r) => r.parent_content_id),
      ...relationsData.remedial.map((r) => r.parent_content_id),
    ];

    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);

    return allLessons.filter((lesson, targetIndex) => {
      if (lesson.id === currentLesson.id) return false;

      if (allUsedIds.includes(lesson.id)) return false;

      if (activeTab === "PREREQUISITE" || activeTab === "REMEDIAL") {
        if (currentIndex === -1) return false;

        return targetIndex < currentIndex;
      }

      return true;
    });
  }, [allLessons, currentLesson, relationsData, activeTab]);

  const handleAddRelation = async () => {
    if (!selectedParentId || !currentLesson) return;

    let weight = 0.5;
    if (activeTab === "PREREQUISITE") weight = 1.0;
    if (activeTab === "REMEDIAL") weight = 0.8;
    if (activeTab === "RELATED") weight = 0.3;

    try {
      await contentMappingService.createRelation({
        parent_content_id: selectedParentId,
        child_content_id: currentLesson.id,
        relation_type: activeTab,
        weight: weight,
      });

      showToast("Đã thêm quan hệ", "success");
      setSelectedParentId("");
      fetchRelations();
    } catch (error) {
      showToast("Lỗi khi thêm quan hệ", "error");
    }
  };

  const handleDelete = async (relationId: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa liên kết này?")) return;
    try {
      await contentMappingService.deleteRelation(relationId);

      setRelationsData((prev) => {
        const newState = { ...prev };
        if (activeTab === "PREREQUISITE") {
          newState.prerequisites = prev.prerequisites.filter(
            (r) => r.id !== relationId
          );
        } else if (activeTab === "REMEDIAL") {
          newState.remedial = prev.remedial.filter((r) => r.id !== relationId);
        } else {
          newState.related = prev.related.filter((r) => r.id !== relationId);
        }
        return newState;
      });

      showToast("Đã xóa", "success");
    } catch (error) {
      showToast("Lỗi khi xóa", "error");
    }
  };

  const getTabColorClass = (tab: RelationType) => {
    if (tab === "PREREQUISITE") return "crd-dot--blue";
    if (tab === "REMEDIAL") return "crd-dot--orange";
    return "crd-dot--purple";
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="crd-overlay" onClick={onClose} />

      <div className="crd-container">
        <div className="crd-header">
          <div style={{ flex: 1 }}>
            <h3 className="crd-title">Cấu trúc bài học</h3>
            <p className="crd-subtitle" title={currentLesson?.title}>
              {currentLesson?.title}
            </p>
          </div>
          <button onClick={onClose} className="crd-close-btn">
            <FaTimes size={16} />
          </button>
        </div>

        <div className="crd-tabs">
          <button
            onClick={() => setActiveTab("PREREQUISITE")}
            className={`crd-tab-btn ${
              activeTab === "PREREQUISITE" ? "crd-tab-btn--active-blue" : ""
            }`}
          >
            <FaBook className="inline mr-2" /> Bài tiên quyết
          </button>

          <button
            onClick={() => setActiveTab("REMEDIAL")}
            className={`crd-tab-btn ${
              activeTab === "REMEDIAL" ? "crd-tab-btn--active-orange" : ""
            }`}
          >
            <FaFirstAid className="inline mr-2" /> Bài bổ trợ
          </button>

          <button
            onClick={() => setActiveTab("RELATED")}
            className={`crd-tab-btn ${
              activeTab === "RELATED" ? "crd-tab-btn--active-purple" : ""
            }`}
          >
            <FaLink className="inline mr-2" /> Bài liên quan
          </button>
        </div>

        <div className="crd-body">
          {isLoading ? (
            <div className="crd-loading">Đang tải...</div>
          ) : (
            <div className="crd-list">
              {displayedRelations.length === 0 ? (
                <div className="crd-empty">
                  Chưa có bài học{" "}
                  {activeTab === "PREREQUISITE"
                    ? "tiên quyết"
                    : activeTab === "REMEDIAL"
                    ? "bổ trợ"
                    : "liên quan"}{" "}
                  nào.
                </div>
              ) : (
                displayedRelations.map((rel) => (
                  <div key={rel.id} className="crd-item">
                    <div className="crd-item-left">
                      <div
                        className={`crd-dot ${getTabColorClass(activeTab)}`}
                      />
                      <span className="crd-item-title">
                        {rel.parentContent?.title || "Unknown Lesson"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(rel.id)}
                      className="crd-delete-btn"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="crd-footer">
          <label className="crd-label">
            Thêm{" "}
            {activeTab === "PREREQUISITE"
              ? "điều kiện tiên quyết"
              : activeTab === "REMEDIAL"
              ? "bài học bổ trợ"
              : "liên kết"}{" "}
            mới
          </label>

          <div className="crd-action-row">
            <select
              className="crd-select"
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
            >
              <option value="">-- Chọn bài học --</option>
              {availableParents.map((l) => {
                const realIndex =
                  allLessons.findIndex((item) => item.id === l.id) + 1;

                return (
                  <option key={l.id} value={l.id}>
                    {realIndex}.{" "}
                    {l.title.length > 50
                      ? l.title.substring(0, 50) + "..."
                      : l.title}
                  </option>
                );
              })}
            </select>

            <button
              disabled={!selectedParentId}
              onClick={handleAddRelation}
              className="crd-add-btn"
              title="Thêm"
            >
              <FaPlus size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentRelationDrawer;
