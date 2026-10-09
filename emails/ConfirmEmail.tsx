import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export function ConfirmEmail({ confirmUrl }: { confirmUrl: string }) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your Grok Bot Daily subscription</Preview>
      <Body style={{ background: "#0b0d12", color: "#f4f1ea", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px 20px", maxWidth: 560 }}>
          <Heading style={{ fontSize: 24 }}>Confirm your subscription</Heading>
          <Text style={{ color: "#9aa3b5", lineHeight: 1.6 }}>
            Thanks for signing up for Grok Bot Daily. Click below to confirm — we only send the
            weekday digest after you opt in.
          </Text>
          <Button
            href={confirmUrl}
            style={{
              background: "linear-gradient(135deg, #7dd3fc, #c4b5fd)",
              color: "#0b0d12",
              padding: "12px 18px",
              borderRadius: 999,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Confirm subscription
          </Button>
          <Text style={{ color: "#9aa3b5", fontSize: 13, marginTop: 24 }}>
            If you did not request this, ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ConfirmEmail;
