import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import "./style/ChatLinkBubble.css"; // CSS riêng cho nút này

interface ChatBubbleProps {
  onClick: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick }) => {
  return (
    <button className="chat-bubble-btn" onClick={onClick}>
      <MessageCircle size={28} />
      <span className="bubble-badge">
        <Sparkles size={12} />
      </span>
    </button>
  );
};

export default ChatBubble;
