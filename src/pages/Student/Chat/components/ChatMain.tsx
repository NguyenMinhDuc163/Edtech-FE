import React, { useLayoutEffect, useRef, useState } from "react";
import { Send, Bot, User, Menu, ArrowDown, X } from "lucide-react";
import { useChatPage } from "./ChatPageContext";
import { MessageParser } from "../libs/MessageParser";
import "../style/ChatMain.css";

export const ChatMain = ({ onCloseWidget }: { onCloseWidget?: () => void }) => {
  const {
    messages,
    currentSessionId,
    isLoadingSession,
    isSending,
    sendMessage,
    toggleSidebar,
  } = useChatPage();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;

      containerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: behavior,
      });
    }
    setShowScrollButton(false);
  };

  const isNearBottom = () => {
    const container = containerRef.current;
    if (!container) return false;

    const threshold = 150;
    const position = container.scrollTop + container.clientHeight;
    const height = container.scrollHeight;

    return height - position <= threshold;
  };

  const handleScroll = () => {
    if (isNearBottom()) {
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  useLayoutEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      scrollToBottom();
      return;
    }

    if (isNearBottom()) {
      scrollToBottom();
    } else {
      if (messages.length > 0) {
        setShowScrollButton(true);
      }
    }
  }, [messages, isSending]);

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    sendMessage(input);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;

    target.style.height = "auto";

    target.style.height = `${Math.min(target.scrollHeight, 100)}px`;

    setInput(target.value);
  };

  return (
    <main className="ai-main">
      <div className="ai-mobile-header">
        <button className="ai-menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <span className="ai-mobile-title">Trợ lý AI</span>
        <button className="ai-menu-btn" onClick={onCloseWidget}>
          <X size={24} />
        </button>
      </div>

      <div
        className="ai-messages-container"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {!currentSessionId && messages.length === 0 && (
          <div className="ai-welcome">
            <h2>Trợ lý Edtech có thể giúp gì cho bạn hôm nay?</h2>
          </div>
        )}

        {isLoadingSession && (
          <div className="ai-loader">Đang tải cuộc trò chuyện...</div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`ai-message-row ${msg.role}`}>
            <div className="ai-avatar">
              {msg.role === "assistant" ? (
                <Bot size={24} />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="ai-bubble">
              <MessageParser content={msg.content} />
            </div>
          </div>
        ))}

        {isSending && (
          <div className="ai-message-row assistant">
            <div className="ai-avatar">
              <Bot size={24} />
            </div>
            <div className="ai-bubble typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
        {showScrollButton && (
          <button
            className="ai-scroll-bottom-btn"
            onClick={() => scrollToBottom()}
          >
            <ArrowDown size={18} />
          </button>
        )}
      </div>

      <div className="ai-input-wrapper">
        <div className="ai-input-box">
          <textarea
            ref={textareaRef}
            placeholder="Gửi tin nhắn cho AI..."
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className="ai-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isSending}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="ai-disclaimer">
          AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
        </p>
      </div>
    </main>
  );
};
