import { Check, Copy } from "lucide-react";
import React from "react";
import Facebook from "../../assets/svgs/icon-facebook.svg";
import Instagram from "../../assets/svgs/icon-instagram.svg";
import QQ from "../../assets/svgs/icon-qq.svg";
import Telegram from "../../assets/svgs/icon-telegram.svg";
import Twitter from "../../assets/svgs/icon-twitter.svg";

const socialPlatforms = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/sharer/sharer.php?u=",
    icon: <img src={Facebook} alt="Facebook" className="h-12 w-12" />,
  },
  {
    name: "Instagram",
    icon: <img src={Instagram} alt="Instagram" className="h-12 w-12" />,
  },
  {
    name: "QQ",
    url: "https://connect.qq.com/widget/shareqq/index.html?url=",
    icon: <img src={QQ} alt="QQ" className="h-12 w-12" />,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/intent/tweet?url=",
    icon: <img src={Twitter} alt="Twitter" className="h-12 w-12" />,
  },
  {
    name: "Telegram",
    url: "https://t.me/share/url?url=",
    icon: <img src={Telegram} alt="Telegram" className="h-12 w-12" />,
  },
];

type ShareSocialListProps = {
  url?: string;
};

export function ShareSocialList({ url = "" }: ShareSocialListProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleSocialShare = (platform: (typeof socialPlatforms)[0]) => {
    if (platform.name === "Instagram") {
      alert("Please copy the link and share manually on Instagram");
      return;
    }
    if (!platform.url) return;
    const shareUrl = platform.url + encodeURIComponent(url);
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="mx-auto w-full p-4">
      <div className="mb-6 grid grid-cols-5 gap-4">
        {socialPlatforms.map((platform) => (
          <div key={platform.name} className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleSocialShare(platform)}
              className="flex items-center justify-center rounded-full text-white transition-transform hover:scale-110"
            >
              {platform.icon}
            </button>
            <span className="text-center text-xs text-gray-300">
              {platform.name}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-center overflow-hidden rounded-lg bg-white/12">
        <div className="flex-1 overflow-hidden rounded-lg px-3 py-2">
          <div className="truncate text-xs text-white">{url}</div>
        </div>
        <button
          onClick={handleCopyLink}
          className={`rounded-tr-lg rounded-br-lg px-4 py-3 transition-colors ${
            copied
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
