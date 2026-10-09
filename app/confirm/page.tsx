import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ConfirmPage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 480 }}>
        <h1>Confirm your subscription</h1>
        <p className="muted">
          Click the button below to finish opting in to Grok Bot Daily. We only add you after this
          step — link scanners cannot confirm for you.
        </p>
        {token ? (
          <form method="POST" action="/api/confirm">
            <input type="hidden" name="token" value={token} />
            <button className="btn btn-primary" type="submit">
              Confirm subscription
            </button>
          </form>
        ) : (
          <p className="form-msg err" role="status">
            Missing or invalid confirmation link.
          </p>
        )}
      </div>
    </main>
  );
}
