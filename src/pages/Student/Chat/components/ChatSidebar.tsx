import { MessageSquarePlus, MessageSquare, X, Trash2 } from "lucide-react";
import { useChatPage } from "./ChatPageContext";
import "../style/ChatSidebar.css";

export const ChatSidebar = () => {
  const {
    sessions,
    currentSessionId,
    selectSession,
    createNewChat,
    isSidebarOpen,
    closeSidebar,
    deleteSession,
    deleteAllSessions,
  } = useChatPage();
  const handleDeleteItem = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  return (
    <>
      <div
        className={`ai-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />
      <aside className={`ai-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="ai-sidebar-header">
          <div className="ai-new-chat-btn" onClick={createNewChat}>
            <MessageSquarePlus size={20} />
            <span>Đoạn chat mới</span>
          </div>
          <button className="ai-sidebar-close-btn" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <div className="ai-session-list">
          <h4 className="ai-list-title">Gần đây</h4>

          {sessions.length === 0 ? (
            <p className="ai-empty-history">Chưa có cuộc trò chuyện nào</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.session_id}
                className={`ai-session-item ${
                  currentSessionId === session.session_id ? "active" : ""
                }`}
                onClick={() => selectSession(session.session_id)}
              >
                <div className="ai-session-content">
                  <MessageSquare size={16} className="session-icon" />
                  <div className="session-info">
                    <span className="session-text">
                      {session.first_message || "Cuộc trò chuyện mới"}
                    </span>
                    <span className="session-time">
                      {new Date(session.created_at).toLocaleDateString(
                        "vi-VN",
                        { day: "2-digit", month: "2-digit" }
                      )}
                    </span>
                  </div>
                </div>

                <button
                  className="ai-item-delete-btn"
                  onClick={(e) => handleDeleteItem(e, session.session_id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
        {sessions.length > 0 && (
          <div className="ai-sidebar-footer">
            <button className="ai-clear-all-btn" onClick={deleteAllSessions}>
              <Trash2 size={16} />
              <span>Xóa tất cả lịch sử</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
