import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export function ConfirmEmail({ confirmUrl }: { confirmUrl: string }) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your Grok Bot Daily subscription</Preview>
      <Body style={{ background: "#ffffff", color: "#0a0a0a", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif" }}>
        <Container style={{ padding: "32px 20px", maxWidth: 560 }}>
          <Heading style={{ fontSize: 24, letterSpacing: "-0.02em" }}>Confirm your subscription</Heading>
          <Text style={{ color: "#3d3d3d", lineHeight: 1.6, fontSize: 16 }}>
            Thanks for signing up for Grok Bot Daily. Tap below to confirm. We only send the daily email after you
            opt in.
          </Text>
          <Button
            href={confirmUrl}
            style={{
              background: "#0a0a0a",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Confirm subscription
          </Button>
          <Text style={{ color: "#5c5c5c", fontSize: 13, marginTop: 24 }}>
            If you didn’t request this, ignore this email and nothing will be sent.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ConfirmEmail;
