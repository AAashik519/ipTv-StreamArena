/**
 * Google AdSense configuration.
 *
 * Replace these placeholder slot IDs with your real ad unit IDs from
 * https://www.google.com/adsense  →  Ads → By ad unit
 *
 * Publisher ID is set via NEXT_PUBLIC_ADSENSE_PUBLISHER_ID in .env.local
 */
export const AD_SLOTS = {
  /** Horizontal banner — shown between sections on the homepage */
  HOME_BANNER: "9086730098",

  /** Horizontal banner — shown below the video player */
  WATCH_BELOW_PLAYER: "6640193440",

  /** Rectangle / sidebar ad — shown inside the watch page sidebar */
  WATCH_SIDEBAR: "5327111777",

  /** In-feed native ad — shown between channel grid rows */
  HOME_IN_FEED: "8939053723",
} as const;
