"use client";

import { useState } from "react";
import { MagneticButton } from "./MagneticButton";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatus("err");
      setMessage("Please confirm you want the weekday digest.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website: hp }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error || "Could not subscribe. Try again in a minute.");
        return;
      }
      setStatus("ok");
      setMessage("Check your inbox for a confirmation link — we only email after you confirm.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("err");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        name="website"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
      />
      <label className="consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          Send me the weekday Grok Bot Daily digest. I can unsubscribe anytime. No spam, no selling
          the list. We store your email with Resend to send the digest.{" "}
          <a href="/privacy">Privacy</a>.
        </span>
      </label>
      <MagneticButton className="btn btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Subscribing…" : "Subscribe free"}
      </MagneticButton>
      {message ? (
        <p className={`form-msg ${status === "ok" ? "ok" : status === "err" ? "err" : ""}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
