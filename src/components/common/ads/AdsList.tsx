import { Card } from "@/components/ui/card";
import React, { useCallback, useMemo } from "react";

interface CommonAds {
  id: string;
  name: string;
  image: string;
  link: string;
  pages: string[];
}

interface AdsListProps {
  currentPage: string;
}

const allAds: CommonAds[] = [
  {
    id: "google",
    name: "Google",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    link: "https://www.google.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "instagram",
    name: "Instagram",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
    link: "https://www.instagram.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "facebook",
    name: "Facebook",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    link: "https://www.facebook.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "youtube",
    name: "YouTube",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    link: "https://www.youtube.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    link: "https://www.linkedin.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "google",
    name: "Google",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    link: "https://www.google.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "instagram",
    name: "Instagram",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
    link: "https://www.instagram.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "facebook",
    name: "Facebook",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    link: "https://www.facebook.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "youtube",
    name: "YouTube",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    link: "https://www.youtube.com",
    pages: ["home", "dashboard", "settings"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    link: "https://www.linkedin.com",
    pages: ["home", "dashboard", "settings"],
  },
];

const AdsList: React.FC<AdsListProps> = ({ currentPage }) => {
  // Use useMemo to memoize the filteredAds array, preventing re-computation on every render
  const filteredAds = useMemo(
    () => allAds.filter((ad) => ad.pages.includes(currentPage)),
    [currentPage],
  );

  // Use useCallback to memoize the handleAdClick function
  const handleAdClick = useCallback((ad: CommonAds) => {
    window.open(ad.link, "_blank");
  }, []);

  return (
    <div className="relative">
      <h2 className="mb-2 text-xl font-semibold">Popular Apps</h2>
      <div className="grid grid-cols-5 gap-4">
        {filteredAds.map((ad, index) => (
          <Card
            // Use a combination of id and index for a unique key if id is not guaranteed to be unique
            key={`${ad.id}-${index}`}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[6px] border-0 py-1 shadow-2xl transition hover:scale-105"
            onClick={() => handleAdClick(ad)}
          >
            <div className="bg-glass mb-2 flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-lg">
              <img
                src={ad.image}
                alt={ad.name}
                className="h-13 w-13 object-contain"
              />
            </div>
            <p className="text-xs font-medium text-white">{ad.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders of the component
export default React.memo(AdsList);
