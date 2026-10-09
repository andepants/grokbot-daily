import type { Metadata } from "next";
import Link from "next/link";
import { GrokBot } from "@/components/GrokBot";

export const metadata: Metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ConfirmPage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return (
    <main id="main" className="container narrow page center-card">
      <GrokBot size={56} mood={token ? "idle" : "lost"} live={Boolean(token)} />
      <h1>{token ? "One tap to confirm" : "This link is incomplete"}</h1>
      {token ? (
        <>
          <p className="lead">Confirm and you’ll get Grok Bot Daily every morning. Nothing is sent until you do.</p>
          <form method="POST" action="/api/confirm">
            <input type="hidden" name="token" value={token} />
            <button className="btn btn-primary btn-lg" type="submit">
              Confirm subscription
            </button>
          </form>
        </>
      ) : (
        <p className="lead">
          Open the link straight from the confirmation email, or <Link href="/#subscribe">subscribe again</Link> to get
          a new one.
        </p>
      )}
    </main>
  );
}
