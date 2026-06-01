"use client";

import { useEffect, useRef, useState } from "react";
import { useIdleTimer } from "~/hooks/use-idle-timer";

const DVD_COLORS = [
  "#0074c2",
  "#e60012",
  "#00a651",
  "#ffcb05",
  "#93328e",
  "#00b5e2",
  "#ffffff",
];

const LOGO_WIDTH = 200;
const LOGO_HEIGHT = 90;
const SPEED = 2.5;

function DvdLogo({ color }: { color: string }) {
  return (
    <svg
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      viewBox="0 0 200 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text
        x="100"
        y="38"
        textAnchor="middle"
        fill={color}
        fontSize="36"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        DVD
      </text>
      <ellipse cx="100" cy="62" rx="70" ry="18" stroke={color} strokeWidth="3" fill="none" />
      <polygon points="100,38 96,44 104,44" fill={color} />
    </svg>
  );
}

function BouncingDvd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [color, setColor] = useState(DVD_COLORS[0]!);
  const stateRef = useRef({
    x: 100,
    y: 100,
    vx: SPEED,
    vy: SPEED,
    colorIndex: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    if (!container || !logo) return;

    const maxX = () => container.clientWidth - LOGO_WIDTH;
    const maxY = () => container.clientHeight - LOGO_HEIGHT;

    const animate = () => {
      const state = stateRef.current;
      state.x += state.vx;
      state.y += state.vy;

      let bounced = false;

      if (state.x <= 0) {
        state.x = 0;
        state.vx = Math.abs(state.vx);
        bounced = true;
      } else if (state.x >= maxX()) {
        state.x = maxX();
        state.vx = -Math.abs(state.vx);
        bounced = true;
      }

      if (state.y <= 0) {
        state.y = 0;
        state.vy = Math.abs(state.vy);
        bounced = true;
      } else if (state.y >= maxY()) {
        state.y = maxY();
        state.vy = -Math.abs(state.vy);
        bounced = true;
      }

      if (bounced) {
        state.colorIndex = (state.colorIndex + 1) % DVD_COLORS.length;
        setColor(DVD_COLORS[state.colorIndex]!);
      }

      logo.style.transform = `translate(${state.x}px, ${state.y}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] overflow-hidden bg-black">
      <div ref={logoRef} className="absolute left-0 top-0 will-change-transform">
        <DvdLogo color={color} />
      </div>
    </div>
  );
}

export function IdleScreensaver() {
  const isIdle = useIdleTimer();

  if (!isIdle) return null;

  return <BouncingDvd />;
}
