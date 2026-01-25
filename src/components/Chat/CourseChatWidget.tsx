import AIChatWidget from "@/pages/Student/Chat/chat";
import { useState } from "react";
import ChatBubble from "./ChatLinkBubble";

interface CourseChatWidgetProps {
  courseId?: string;
  contentId?: string;
}

const CourseChatWidget = ({ courseId, contentId }: CourseChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. Nếu đóng thì hiện Bubble */}
      {!isOpen && (
        <ChatBubble onClick={() => setIsOpen(true)} />
      )}

      {/* 2. Nếu mở thì hiện Widget */}
      {/* Lưu ý: Dùng điều kiện && để mount/unmount giúp reset state khi mở lại */}
      {isOpen && (
        <AIChatWidget
          onClose={() => setIsOpen(false)}
          courseId={courseId}
          contentId={contentId}
        />
      )}
    </>
  );
};

export default CourseChatWidget;