import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components";

export function IssueEmail({
  title,
  description,
  htmlBody,
  issueUrl,
  unsubscribeUrl,
  mailingAddress,
}: {
  title: string;
  description: string;
  htmlBody: string;
  issueUrl: string;
  unsubscribeUrl: string;
  mailingAddress: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{description}</Preview>
      <Body style={{ background: "#0b0d12", color: "#f4f1ea", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px 20px", maxWidth: 600 }}>
          <Text style={{ color: "#7dd3fc", letterSpacing: 2, fontSize: 12, fontWeight: 700 }}>
            GROK BOT DAILY
          </Text>
          <Heading style={{ fontSize: 26, marginTop: 8 }}>{title}</Heading>
          <Text style={{ color: "#9aa3b5" }}>{description}</Text>
          <Text style={{ color: "#9aa3b5" }}>
            Read on the web: <Link href={issueUrl}>{issueUrl}</Link>
          </Text>
          <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
          <Text style={{ color: "#9aa3b5", fontSize: 12, marginTop: 32, borderTop: "1px solid #222", paddingTop: 16 }}>
            You are receiving this because you confirmed a subscription to Grok Bot Daily.{" "}
            <Link href={unsubscribeUrl}>Unsubscribe</Link>
          </Text>
          <Text style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.5 }}>
            The Heim Life LLC
            <br />
            {mailingAddress}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default IssueEmail;
