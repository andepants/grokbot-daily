"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";
import { GrokBot } from "./GrokBot";

type Notice = { ok: boolean; title: string; body: React.ReactNode };

const NOTICES: Record<string, Record<string, Notice>> = {
  confirmed: {
    "1": { ok: true, title: "You’re subscribed", body: "Your first issue arrives tomorrow morning." },
    "0": {
      ok: false,
      title: "That confirmation link didn’t work",
      body: "It may have expired. Enter your email below to get a fresh one.",
    },
  },
  unsubscribed: {
    "1": { ok: true, title: "You’re unsubscribed", body: "You won’t get any more Grok Bot Daily emails." },
    "0": {
      ok: false,
      title: "That unsubscribe link didn’t work",
      body: (
        <>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we’ll remove you by hand.
        </>
      ),
    },
  },
};

/** Reads ?confirmed= / ?unsubscribed= set by the API redirects, then cleans the URL. */
export function StatusNotice() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const key of Object.keys(NOTICES)) {
      const v = params.get(key);
      if (v && NOTICES[key][v]) {
        setNotice(NOTICES[key][v]);
        params.delete(key);
        const qs = params.toString();
        window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (notice) ref.current?.focus();
  }, [notice]);

  if (!notice) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={notice.ok ? "status" : "alert"}
      className={`notice ${notice.ok ? "notice-ok" : "notice-err"}`}
      data-notice
    >
      <GrokBot size={32} mood={notice.ok ? "happy" : "lost"} className={notice.ok ? "bot-hop" : undefined} />
      <div>
        <p className="notice-title">{notice.title}</p>
        <p className="notice-body">{notice.body}</p>
      </div>
      <button type="button" className="notice-close" aria-label="Dismiss" onClick={() => setNotice(null)}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
