"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { SUBSCRIBE_CONSENT_TEXT } from "@/lib/site";
import { GrokBot } from "./GrokBot";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SubscribeForm({ formId, autoFocus = false }: { formId?: string; autoFocus?: boolean }) {
  const reactId = useId();
  const emailId = formId ? `${formId}-email` : `email-${reactId}`;
  const errId = `${emailId}-error`;
  const consentId = `${emailId}-consent`;
  const successRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "ok") successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim().length === 0) {
      setStatus("err");
      setMessage("Enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("err");
      setMessage("That email doesn’t look right. Check for typos.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, website: hp }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error || "Couldn’t subscribe. Try again in a minute.");
        return;
      }
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  if (status === "ok") {
    return (
      <div ref={successRef} className="subscribe-success" data-subscribe-success="true" role="status" tabIndex={-1}>
        <GrokBot size={40} mood="happy" className="bot-hop" />
        <div>
          <p className="subscribe-success-title">Check your inbox</p>
          <p className="muted">Tap the confirm button in the email we just sent. No confirm, no emails.</p>
        </div>
      </div>
    );
  }

  const isErr = status === "err" && message.length > 0;

  return (
    <form className="subscribe-form" onSubmit={onSubmit} noValidate aria-busy={status === "loading"}>
      <div className="subscribe-row">
        <label className="sr-only" htmlFor={emailId}>
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          enterKeyHint="go"
          required
          autoFocus={autoFocus}
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={isErr || undefined}
          aria-describedby={`${isErr ? `${errId} ` : ""}${consentId}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "err") setStatus("idle");
          }}
        />
        <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {isErr ? (
        <p id={errId} className="form-msg err" role="alert">
          {message}
        </p>
      ) : null}
      <p id={consentId} className="subscribe-consent muted">
        {SUBSCRIBE_CONSENT_TEXT} <Link href="/privacy">Privacy</Link>
      </p>
      <input
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        name="website"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
      />
    </form>
  );
}
