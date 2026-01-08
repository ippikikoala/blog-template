"use client";

import { useEffect, useState, useCallback } from "react";

export default function Lightbox() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const closeLightbox = useCallback(() => {
    setImageSrc(null);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" && target.closest(".prose")) {
        const img = target as HTMLImageElement;
        setImageSrc(img.src);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox]);

  if (!imageSrc) return null;

  return (
    <div className="lightbox-overlay" onClick={closeLightbox}>
      <button className="lightbox-close" aria-label="閉じる">
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt="" className="lightbox-image" />
    </div>
  );
}
