"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  adSlot: string;
  /** "auto" for display ads, "fluid" for in-feed/in-article native ads */
  adFormat?: "auto" | "fluid";
  /** Only needed for fluid in-article ads — get this value from AdSense dashboard */
  adLayoutKey?: string;
  className?: string;
}

export default function AdBanner({
  adSlot,
  adFormat = "auto",
  adLayoutKey,
  className = "",
}: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Blocked by ad-blocker or AdSense not loaded yet
    }
  }, [adSlot]);

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!publisherId || publisherId.includes("XXXXXXXXX")) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: adFormat === "fluid" ? "block" : "block",
          width: "100%",
          minHeight: adFormat === "fluid" ? undefined : 90,
        }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        {...(adFormat === "fluid" && adLayoutKey
          ? { "data-ad-layout-key": adLayoutKey }
          : {})}
        {...(adFormat === "fluid" && !adLayoutKey
          ? { "data-ad-layout": "in-article" }
          : {})}
      />
    </div>
  );
}
