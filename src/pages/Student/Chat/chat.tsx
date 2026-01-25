import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMain } from "./components/ChatMain";
import "./style/chat.css";
import { ChatPageProvider } from "./components/ChatPageContext";

interface AIChatWidgetProps {
  onClose: () => void;
  courseId?: string;
  contentId?: string;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  onClose,
  courseId,
  contentId,
}) => {
  return (
    <ChatPageProvider courseId={courseId} contentId={contentId}>
      <div className="ai-page-layout">
        <ChatSidebar />
        <ChatMain onCloseWidget={onClose} />
      </div>
    </ChatPageProvider>
  );
};

export default AIChatWidget;
