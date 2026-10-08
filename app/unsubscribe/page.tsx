import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 480 }}>
        <h1>Unsubscribe</h1>
        <p className="muted">
          This only opts you out of Grok Bot Daily. It does not change other lists on the same
          sending account. Click below to confirm.
        </p>
        {token ? (
          <form method="POST" action={`/api/unsubscribe?token=${encodeURIComponent(token)}`}>
            <input type="hidden" name="token" value={token} />
            <button className="btn btn-primary" type="submit">
              Unsubscribe from Grok Bot Daily
            </button>
          </form>
        ) : (
          <p className="form-msg err" role="status">
            Missing or invalid unsubscribe link.
          </p>
        )}
      </div>
    </main>
  );
}
