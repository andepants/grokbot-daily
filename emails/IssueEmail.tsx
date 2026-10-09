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
      <Body style={{ background: "#ffffff", color: "#0a0a0a", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", lineHeight: 1.6 }}>
        <Container style={{ padding: "32px 20px", maxWidth: 600 }}>
          <Text style={{ color: "#5c5c5c", fontSize: 13, fontWeight: 600 }}>Grok Bot Daily</Text>
          <Heading style={{ fontSize: 26, marginTop: 8, letterSpacing: "-0.02em" }}>{title}</Heading>
          <Text style={{ color: "#3d3d3d" }}>{description}</Text>
          <Text style={{ color: "#5c5c5c", fontSize: 14 }}>
            Read on the web: <Link href={issueUrl} style={{ color: "#0a0a0a" }}>{issueUrl}</Link>
          </Text>
          <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
          <Text style={{ color: "#5c5c5c", fontSize: 12, marginTop: 32, borderTop: "1px solid #e5e5e5", paddingTop: 16 }}>
            You are receiving this because you confirmed a subscription to Grok Bot Daily.{" "}
            <Link href={unsubscribeUrl} style={{ color: "#0a0a0a" }}>Unsubscribe</Link>
          </Text>
          <Text style={{ color: "#5c5c5c", fontSize: 11, lineHeight: 1.5 }}>
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
