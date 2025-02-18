"use client";
import { useEffect, useRef, useState } from "react";

const ChatUI = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // 🔹 iOS 키보드 감지 & 높이 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const newHeight = window.innerHeight - window.visualViewport.height;
        const isOpen = window.visualViewport.height < window.innerHeight * 0.8;

        requestAnimationFrame(() => {
          // setIsKeyboardOpen(isOpen);
          setKeyboardHeight(isOpen ? newHeight : 0);
        });
      }
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  // 🔹 textarea focus 시 부드럽게 이동 (requestAnimationFrame 사용)
  const handleFocus = () => {
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      // setIsKeyboardOpen(true);
    });

    document.addEventListener("touchmove", preventScroll, { passive: false });
  };

  const handleBlur = () => {
    document.body.style.overflow = "";
    document.removeEventListener("touchmove", preventScroll);

    requestAnimationFrame(() => {
      // setIsKeyboardOpen(false);
      setKeyboardHeight(0);
    });
  };

  // 🔹 chat-messages 내부에서는 스크롤 허용
  const preventScroll = (e: TouchEvent) => {
    if (chatMessagesRef.current?.contains(e.target as Node)) return;
    e.preventDefault(); // 🔥 외부 스크롤 방지
  };

  return (
    <>
      <style>{`html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* 🔹 기본적으로 body 스크롤 방지 */
  -webkit-overflow-scrolling: touch;
}

.chat-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100dvh;
  height: 100vh;
  background: #f5f5f5;
  position: relative;
}

.chat-messages {
  flex-grow: 1; /* 🔹 키보드가 올라와도 자동 조정 */
  padding: 1.6rem 1.6rem 6rem 1.6rem;
  max-height: calc(100dvh - 6rem); /* 기본 높이 */
  max-height: calc(100vh - 6rem);
  overflow:hidden;
  overflow-y: auto; /* 🔥 chat-messages 스크롤 유지 */
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

p {
height:20rem;
background-color:blue;
color: white;
margin: 2rem 0;
}
.input-container {
  position: fixed;
  left: 0;
  width: 100%;
  background: white;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid #ddd;
  transition: .1s
}


textarea {
  width: 100%;
  padding: 10px;
  font-size: 1.6rem;
  border: none;
  outline: none;
  resize: none;
  height: 5rem;
}
`}</style>
      <div ref={chatContainerRef} className="chat-container">
        <div ref={chatMessagesRef} className="chat-messages" style={{ paddingBottom: keyboardHeight }}>
          {/* 채팅 메시지 샘플 */}
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>메시지 {i + 1}</p>
          ))}
        </div>

        {/* 🔹 textarea를 키보드 위로 고정 */}
        <div className="input-container" style={{ bottom: 0 }}>
          <textarea ref={textareaRef} onFocus={handleFocus} onBlur={handleBlur} placeholder="메시지를 입력하세요..." />
        </div>

        {/* 🔹 textarea를 부드럽게 이동 (초기 렌더링 문제 해결) */}
        {/* <div
          className="input-container"
          style={{
            transform: isKeyboardOpen ? `translateY(-${keyboardHeight}px)` : "none",
            opacity: isKeyboardOpen ? 1 : 0,
            transition: isKeyboardOpen ? "transform 0.2s ease-out, opacity 0.2s ease-out" : "opacity 0.2s ease-out",
          }}
        >
          <textarea ref={textareaRef} onFocus={handleFocus} onBlur={handleBlur} placeholder="메시지를 입력하세요..." />
        </div> */}
      </div>
    </>
  );
};

export default ChatUI;
