"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Ask me about Atlas, Optimus, Figure 01, ASIMO, Ameca, or Unitree H1.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "That request didn't go through. Try asking again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Couldn't reach the server. Check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <style jsx global>{`
        .lg-panel {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.13) 0%,
            rgba(255, 255, 255, 0.05) 45%,
            rgba(255, 255, 255, 0.09) 100%
          );
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 8px 40px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -1px 0 rgba(255, 255, 255, 0.06);
        }
        .lg-bubble {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.06) 100%
          );
          backdrop-filter: blur(28px) saturate(200%);
          -webkit-backdrop-filter: blur(28px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow:
            0 10px 32px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        .lg-msg-user {
          background: linear-gradient(
            145deg,
            rgba(120, 190, 255, 0.28) 0%,
            rgba(90, 150, 255, 0.16) 100%
          );
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(160, 210, 255, 0.24);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .lg-msg-bot {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.11);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }
        .lg-input {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.13);
        }
        .lg-input:focus {
          border-color: rgba(150, 205, 255, 0.5);
          background: rgba(255, 255, 255, 0.09);
        }
        .lg-send {
          background: linear-gradient(
            145deg,
            rgba(130, 195, 255, 0.32) 0%,
            rgba(90, 150, 255, 0.2) 100%
          );
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(165, 215, 255, 0.3);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34);
        }
        .lg-send:hover:not(:disabled) {
          background: linear-gradient(
            145deg,
            rgba(150, 210, 255, 0.42) 0%,
            rgba(105, 165, 255, 0.28) 100%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .lg-anim {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="lg-panel lg-anim flex h-[32rem] w-[23rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[28px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[15px] font-semibold tracking-tight text-white">
                  Humanoid Robot Assistant
                </p>
                <p className="text-xs text-white/45">
                  Answers from our robot documentation
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-full px-2.5 py-1 text-white/50 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "lg-msg-user max-w-[85%] rounded-[20px] rounded-br-md px-4 py-2.5 text-sm leading-relaxed text-white"
                        : "lg-msg-bot max-w-[85%] rounded-[20px] rounded-bl-md px-4 py-2.5 text-sm leading-relaxed text-white/90"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="lg-msg-bot rounded-[20px] rounded-bl-md px-4 py-3">
                    <span className="inline-flex gap-1.5">
                      <span className="lg-anim h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
                      <span className="lg-anim h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
                      <span className="lg-anim h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about a robot..."
                  disabled={isLoading}
                  className="lg-input flex-1 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/35 outline-none transition disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="lg-send rounded-full px-5 py-2.5 text-sm font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating bubble */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className="lg-bubble lg-anim flex h-14 w-14 items-center justify-center rounded-full text-2xl transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60"
        >
          {isOpen ? "✕" : "🤖"}
        </button>
      </div>
    </>
  );
}