"use client";

import { LottieLight } from "lottie-react";
import { useReducedMotion } from "motion/react";
import animationData from "../public/lottie/bot-pulse.json";

export default function HeroLottiePlayer() {
  const reduce = useReducedMotion();
  return (
    <div data-lottie="bot-pulse">
      <LottieLight
        src={animationData}
        autoplay={!reduce}
        loop={!reduce}
        style={{ width: 140, height: 140 }}
      />
    </div>
  );
}
