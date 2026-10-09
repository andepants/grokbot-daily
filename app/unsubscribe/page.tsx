import type { Metadata } from "next";
import { GrokBot } from "@/components/GrokBot";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return (
    <main id="main" className="container narrow page center-card">
      <GrokBot size={56} mood={token ? "idle" : "lost"} />
      <h1>{token ? "Unsubscribe from Grok Bot Daily?" : "This link is incomplete"}</h1>
      {token ? (
        <>
          <p className="lead">You’ll stop getting the daily email. Other lists aren’t affected.</p>
          <form method="POST" action={`/api/unsubscribe?token=${encodeURIComponent(token)}`}>
            <input type="hidden" name="token" value={token} />
            <button className="btn btn-primary btn-lg" type="submit">
              Unsubscribe
            </button>
          </form>
        </>
      ) : (
        <p className="lead">
          Use the unsubscribe link at the bottom of any issue, or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we’ll remove you.
        </p>
      )}
    </main>
  );
}
