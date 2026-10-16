"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send, Trash2 } from "lucide-react";
import {
  deleteMessage,
  fetchMessages,
  sendMessage,
  type ChatMessage,
} from "@/app/trips/actions";

export default function TripChat({
  tripId,
  currentUserId,
  initial,
  canSend,
  isAdmin,
  closedReason,
}: {
  tripId: string;
  currentUserId: string;
  initial: ChatMessage[];
  canSend: boolean;
  isAdmin: boolean;
  closedReason?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  // Check for new messages every 4 seconds
  useEffect(() => {
    let active = true;

    async function poll() {
      if (document.hidden) return;
      try {
        const latest = await fetchMessages(tripId);
        if (active) setMessages(latest);
      } catch {
        // ignore temporary network errors
      }
    }

    const timer = setInterval(poll, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [tripId]);

  // Scroll the chat box (not the page) to the newest message
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setError(undefined);

    startTransition(async () => {
      const res = await sendMessage(tripId, value);
      if (res.error) {
        setError(res.error);
        return;
      }
      setText("");
      setMessages(await fetchMessages(tripId));
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    startTransition(async () => {
      const res = await deleteMessage(id);
      if (res.error) {
        setError(res.error);
        return;
      }
      setMessages(await fetchMessages(tripId));
    });
  }

  return (
    <div className="flex h-[32rem] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="border-b border-slate-100 px-5 py-3">
        <h2 className="font-semibold">Group chat</h2>
        <p className="text-xs text-slate-500">Only travelers on this trip can see this chat</p>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
        {messages.length === 0 && (
          <p className="pt-10 text-center text-sm text-slate-500">
            No messages yet. Say hello to your travel group!
          </p>
        )}

        {messages.map((m) => {
          const mine = m.userId === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[80%]">
                <p className={`mb-0.5 px-1 text-xs text-slate-500 ${mine ? "text-right" : ""}`}>
                  {mine ? "You" : m.userName} ·{" "}
                  <span suppressHydrationWarning>
                    {new Date(m.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
                <div
                  className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm ${
                    mine
                      ? "rounded-br-sm bg-blue-600 text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {m.text}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => remove(m.id)}
                    className="mt-1 inline-flex items-center gap-1 px-1 text-xs text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {canSend ? (
        <form onSubmit={submit} className="border-t border-slate-100 p-3">
          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message..."
              maxLength={1000}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              disabled={pending || !text.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </form>
      ) : (
        <p className="border-t border-slate-100 p-4 text-center text-sm text-slate-500">
          {closedReason ?? "You can read this chat but not write in it."}
        </p>
      )}
    </div>
  );
}