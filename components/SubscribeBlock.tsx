import { SubscribeForm } from "./SubscribeForm";

type Props = {
  id?: string;
  title?: string;
  titleId?: string;
  lead?: string;
  formId?: string;
  className?: string;
};

export function SubscribeBlock({
  id,
  title = "Get Grok Bot Daily",
  titleId,
  lead = "One email on weekdays when there’s something worth your time. Double opt-in.",
  formId,
  className,
}: Props) {
  return (
    <div className={`subscribe-block surface ${className ?? ""}`.trim()} id={id}>
      {title ? (
        <h2 id={titleId} className="subscribe-block-title">
          {title}
        </h2>
      ) : null}
      {lead ? <p className="subscribe-block-lead muted">{lead}</p> : null}
      <SubscribeForm formId={formId ?? id} />
    </div>
  );
}
