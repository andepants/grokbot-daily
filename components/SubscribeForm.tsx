"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { SUBSCRIBE_CONSENT_TEXT } from "@/lib/site";
import { MagneticButton } from "./MagneticButton";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SubscribeForm({ formId }: { formId?: string }) {
  const reactId = useId();
  const emailId = formId ? `${formId}-email` : `email-${reactId}`;
  const errId = `${emailId}-error`;
  const successRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [blurInvalid, setBlurInvalid] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const reduce = useReducedMotion();

  const trimmed = email.trim();
  const emptyOnSubmit = submitAttempted && trimmed.length === 0;
  const invalidEmail =
    (submitAttempted && trimmed.length > 0 && !isValidEmail(email)) ||
    (blurInvalid && trimmed.length > 0 && !isValidEmail(email));
  const showFieldError = emptyOnSubmit || invalidEmail;

  useEffect(() => {
    if (status === "ok") {
      successRef.current?.focus();
    }
  }, [status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (trimmed.length === 0) {
      setStatus("err");
      setMessage("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("err");
      setMessage("Enter a valid email address.");
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
      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error || "Could not subscribe. Try again in a minute.");
        return;
      }
      setStatus("ok");
      setMessage("");
      setEmail("");
      setSubmitAttempted(false);
      setBlurInvalid(false);
    } catch {
      setStatus("err");
      setMessage("Network error. Try again.");
    }
  }

  function onEmailBlur() {
    if (trimmed.length > 0 && !isValidEmail(email)) {
      setBlurInvalid(true);
    } else {
      setBlurInvalid(false);
    }
  }

  if (status === "ok") {
    return (
      <div
        ref={successRef}
        className="subscribe-success"
        data-subscribe-success="true"
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <motion.div
          className="subscribe-success-icon"
          initial={reduce ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <CheckCircle size={40} weight="fill" aria-hidden />
        </motion.div>
        <motion.p
          className="subscribe-success-title"
          initial={reduce ? false : { y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          Check your inbox to confirm
        </motion.p>
        <motion.p
          className="subscribe-success-sub muted"
          initial={reduce ? false : { y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.14, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          We sent a confirmation link. You&apos;ll only get the digest after you tap confirm.
        </motion.p>
      </div>
    );
  }

  const errorText =
    message ||
    (emptyOnSubmit ? "Email is required." : invalidEmail ? "Enter a valid email address." : "");

  return (
    <form className="subscribe-form" onSubmit={onSubmit} noValidate>
      <div className="subscribe-row">
        <label className="sr-only" htmlFor={emailId}>
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          enterKeyHint="go"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={showFieldError ? "input-invalid" : undefined}
          aria-invalid={showFieldError || undefined}
          aria-describedby={errorText ? errId : undefined}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "err") setStatus("idle");
            if (blurInvalid && isValidEmail(e.target.value)) setBlurInvalid(false);
          }}
          onBlur={onEmailBlur}
        />
        <MagneticButton className="btn btn-primary subscribe-submit" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Subscribe"}
        </MagneticButton>
      </div>
      <p className="subscribe-consent muted">
        {SUBSCRIBE_CONSENT_TEXT}{" "}
        <Link href="/privacy">Privacy</Link>.
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
      <AnimatePresence mode="wait">
        {errorText ? (
          <motion.p
            key="err"
            id={errId}
            className="form-msg err"
            role="alert"
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {errorText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
