"use client";

import React, { useEffect, useState, useCallback } from "react";

interface Burst {
  id: string;
  x: number;
  y: number;
}

interface BurstInstanceProps {
  x: number;
  y: number;
  onComplete: () => void;
}

function BurstInstance({ x, y, onComplete }: BurstInstanceProps) {
  useEffect(() => {
    // Auto-remove after animation completes (500ms duration + 100ms safety buffer)
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-[99999]"
      style={{ left: x, top: y }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className="block overflow-visible"
      >
        {/* Concentric Outer Ring */}
        <circle
          cx="40"
          cy="40"
          r="8"
          fill="none"
          stroke="var(--accent-brand, #fb923c)"
          strokeWidth="2"
          className="animate-click-ring"
        />
        {/* Concentric Inner Ring */}
        <circle
          cx="40"
          cy="40"
          r="4"
          fill="none"
          stroke="var(--accent-dark, #ea580c)"
          strokeWidth="1.5"
          className="animate-click-inner-ring"
        />

        {/* Spark Rays */}
        {[...Array(8)].map((_, i) => {
          const angle = i * 45;
          const strokeColor =
            i % 3 === 0
              ? "var(--accent-brand, #fb923c)"
              : i % 3 === 1
                ? "var(--accent-dark, #ea580c)"
                : "#fbbf24"; // golden-yellow

          return (
            <g key={i} transform={`rotate(${angle} 40 40)`}>
              <line
                x1="40"
                y1="30"
                x2="40"
                y2="20"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-click-spark"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ClickBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0) return;

      // Ignore inputs, selects, textareas, etc. to prevent distracting the user
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "select" ||
          tagName === "option" ||
          target.isContentEditable ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("[role='combobox']")
        ) {
          return;
        }
      }

      const newBurst: Burst = {
        id: `${Date.now()}-${Math.random()}`,
        x: e.clientX,
        y: e.clientY,
      };

      setBursts((prev) => [...prev, newBurst]);
    };

    // Use event capturing (capture: true) so clicks trigger even if propagation is stopped on children (e.g. Radix components)
    window.addEventListener("click", handleClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  const removeBurst = useCallback((id: string) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      <style>{`
        @keyframes clickRing {
          0% {
            transform: scale(0.5);
            opacity: 0.95;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes clickInnerRing {
          0% {
            transform: scale(0.3);
            opacity: 0.85;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @keyframes clickSpark {
          0% {
            transform: translateY(12px) scaleY(0.3);
            opacity: 0.2;
          }
          20% {
            transform: translateY(6px) scaleY(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-22px) scaleY(0.2);
            opacity: 0;
          }
        }
        .animate-click-ring {
          transform-origin: 40px 40px;
          animation: clickRing 400ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        .animate-click-inner-ring {
          transform-origin: 40px 40px;
          animation: clickInnerRing 300ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        .animate-click-spark {
          /* No local transform-origin needed as it translates along the rotated group Y-axis */
          animation: clickSpark 500ms cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }
      `}</style>
      {bursts.map((burst) => (
        <BurstInstance
          key={burst.id}
          x={burst.x}
          y={burst.y}
          onComplete={() => removeBurst(burst.id)}
        />
      ))}
    </div>
  );
}
