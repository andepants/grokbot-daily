"use client";

import dynamic from "next/dynamic";

const Player = dynamic(() => import("./HeroLottiePlayer"), { ssr: false });

export function HeroLottie() {
  return (
    <div className="hero-lottie" aria-hidden>
      <Player />
    </div>
  );
}
