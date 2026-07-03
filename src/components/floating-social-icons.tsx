"use client";

import Image from "next/image";
import React from "react";

interface IconConfig {
  name: string;
  src: string;
  className: string; // floating animation class
}

const SOCIAL_ICONS: IconConfig[] = [
  {
    name: "Instagram",
    src: "/social-icons/instagram.png",
    className: "animate-float-1",
  },
  {
    name: "Facebook",
    src: "/social-icons/facebook-circle.png",
    className: "animate-float-2",
  },
  {
    name: "Twitter / X",
    src: "/social-icons/twitter-circle.png",
    className: "animate-float-3",
  },
  {
    name: "TikTok",
    src: "/social-icons/tiktok-circle.png",
    className: "animate-float-4",
  },
  {
    name: "YouTube",
    src: "/social-icons/youtube.png",
    className: "animate-float-5",
  },
  {
    name: "LinkedIn",
    src: "/social-icons/linkedin.png",
    className: "animate-float-6",
  },
];

export default function FloatingSocialIcons() {
  return (
    <div className="mb-6 flex justify-center items-center gap-5 px-4">
      {SOCIAL_ICONS.map((icon) => (
        <div
          key={icon.name}
          className={`${icon.className} size-8 sm:w-10 sm:h-10 md:size-9 opacity-50 hover:opacity-100 hover:scale-115 transition duration-300 ease-out cursor-pointer relative`}
          title={icon.name}
        >
          <Image
            src={icon.src}
            alt={icon.name}
            fill
            sizes="(max-width: 768px) 36px, (max-width: 1024px) 40px, 44px"
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}
