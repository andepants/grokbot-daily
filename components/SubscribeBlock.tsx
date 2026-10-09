import { SubscribeForm } from "./SubscribeForm";

type Props = { id?: string; title?: string; lead?: string; formId?: string };

/** Compact end-of-page subscribe section (one per page). */
export function SubscribeBlock({
  id,
  title = "Get it every morning",
  lead = "One short email a day. Free. Unsubscribe in one click.",
  formId,
}: Props) {
  const headingId = `${formId ?? id ?? "subscribe"}-title`;
  return (
    <section className="subscribe-block" id={id} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      <p className="muted">{lead}</p>
      <SubscribeForm formId={formId ?? id} />
    </section>
  );
}
