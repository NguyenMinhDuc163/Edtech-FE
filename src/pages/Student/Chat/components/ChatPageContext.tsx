import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useToast } from "@/components/Notification/common/ToastProvider";
import {
  chatService,
  type ChatMessage,
  type Session,
} from "@/services/Chat/chatService";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
interface ChatPageContextType {
  sessions: Session[];
  messages: ChatMessage[];
  currentSessionId: string | null;
  isLoadingSession: boolean;
  isSending: boolean;

  createNewChat: () => void;
  selectSession: (id: string) => void;
  sendMessage: (text: string) => Promise<void>;
  loadMoreSessions: () => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  deleteSession: (sessionId: string) => void;
  deleteAllSessions: () => void;
}

const ChatPageContext = createContext<ChatPageContextType | undefined>(
  undefined
);

interface ChatPageProviderProps {
  children: ReactNode;
  courseId?: string;
  contentId?: string;
}

export const ChatPageProvider = ({
  children,
  courseId,
  contentId,
}: ChatPageProviderProps) => {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const closeConfirm = () => {
    setConfirmConfig((prev) => ({ ...prev, open: false }));
  };

  const fetchSessions = async () => {
    try {
      const res: any = await chatService.getSessions(1, 20);
      setSessions(res.sessions || []);
    } catch (error) {
      console.error("Lỗi tải lịch sử chat", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const selectSession = async (id: string) => {
    if (id === currentSessionId) return;
    setCurrentSessionId(id);
    setIsLoadingSession(true);
    try {
      const res: any = await chatService.getSessionMessages(id);
      setMessages(res.messages || []);
    } catch (error) {
      console.error("Lỗi tải tin nhắn", error);
    } finally {
      setIsLoadingSession(false);
      closeSidebar();
    }
  };

  const createNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    closeSidebar();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) {
      showToast("Vui lòng nhập nội dung muốn hỏi!", "warning");
      return;
    }

    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const res = await chatService.sendMessage(
        text,
        currentSessionId || undefined,
        courseId,
        contentId
      );

      if (!currentSessionId && res.session_id) {
        const newSessionIdStr = String(res.session_id);
        setCurrentSessionId(newSessionIdStr);
        fetchSessions();
      }

      const botMsg: ChatMessage = {
        id: Date.now().toString() + "_bot",
        role: "assistant",
        content: res.response_raw,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      showToast("Gửi tin nhắn thất bại", "warning");
    } finally {
      setIsSending(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    setConfirmConfig({
      open: true,
      title: "Xóa cuộc trò chuyện",
      message:
        "Bạn có chắc muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.",
      onConfirm: async () => {
        closeConfirm();
        try {
          const response = await chatService.deleteSession(sessionId);
          if (response.status === 200) {
            setSessions((prev) =>
              prev.filter((s) => s.session_id !== sessionId)
            );

            if (currentSessionId === sessionId) {
              setCurrentSessionId(null);
              setMessages([]);
            }

            showToast("Đoạn chat được xóa thành công", "success");
          } else {
            showToast(
              "Có lỗi trong quá trình xóa cuộc trò chuyện này. Vui lòng thử lại sau!",
              "warning"
            );
          }
        } catch (error) {
          showToast(
            "Có lỗi trong quá trình xóa cuộc trò chuyện này. Vui lòng thử lại sau!",
            "error"
          );
        }
      },
    });
  };

  const deleteAllSessions = () => {
    setConfirmConfig({
      open: true,
      title: "Xóa tất cả lịch sử",
      message:
        "CẢNH BÁO: Tất cả lịch sử chat sẽ bị xóa vĩnh viễn. Bạn có chắc chắn không?",
      onConfirm: async () => {
        try {
          await chatService.deleteSession("");
          setSessions([]);
          setCurrentSessionId(null);
          setMessages([]);
          closeConfirm();
        } catch (error) {
          showToast(
            "Có lỗi trong quá trình xóa cuộc trò chuyện. Vui lòng thử lại sau!",
            "error"
          );
        }
      },
    });
  };

  const loadMoreSessions = () => {};

  return (
    <ChatPageContext.Provider
      value={{
        sessions,
        messages,
        currentSessionId,
        isLoadingSession,
        isSending,
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        createNewChat,
        selectSession,
        sendMessage,
        loadMoreSessions,
        deleteSession,
        deleteAllSessions,
      }}
    >
      {children}
      <ConfirmDialog
        open={confirmConfig.open}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirm}
      />
    </ChatPageContext.Provider>
  );
};

export const useChatPage = () => {
  const context = useContext(ChatPageContext);
  if (!context) throw new Error("Có lỗi trong quá trình khởi tạo chat");
  return context;
};
