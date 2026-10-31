import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "ShareBite | Turn surplus food into community impact",
    description: "ShareBite connects surplus food with NGOs and communities quickly, safely, and intelligently.",
  },
  "/privacy": {
    title: "Privacy Policy | ShareBite",
    description: "Learn how ShareBite collects, uses, and protects information.",
  },
  "/terms": {
    title: "Terms & Conditions | ShareBite",
    description: "Review the rules and conditions for using ShareBite.",
  },
};

const upsertMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = pageMetadata[pathname] || (
      pathname === "/user/login" ? {
        title: "Log in | ShareBite",
        description: "Log in to coordinate food donations with ShareBite.",
      } : pathname === "/user/signup" ? {
        title: "Create an account | ShareBite",
        description: "Create a ShareBite account and start making surplus matter.",
      } : pathname === "/user/forgotPassword" ? {
        title: "Reset your password | ShareBite",
        description: "Securely reset your ShareBite account password.",
      } : pathname.includes("/donationForm") ? {
        title: "Create a donation | ShareBite",
        description: "List surplus food for local redistribution through ShareBite.",
      } : pathname.includes("/listings") ? {
        title: "Available donations | ShareBite",
        description: "Find available food donations and coordinate a pickup.",
      } : {
      title: "ShareBite | Food redistribution platform",
      description: "Coordinate food donations and deliveries with ShareBite.",
      }
    );
    const image = `${window.location.origin}/og-image.png`;

    document.title = metadata.title;
    upsertMeta("name", "description", metadata.description);
    upsertMeta("property", "og:title", metadata.title);
    upsertMeta("property", "og:description", metadata.description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", window.location.href);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", metadata.title);
    upsertMeta("name", "twitter:description", metadata.description);
    upsertMeta("name", "twitter:image", image);
  }, [pathname]);

  return null;
}
