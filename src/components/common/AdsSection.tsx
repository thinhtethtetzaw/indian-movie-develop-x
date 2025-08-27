import { COMMON_ANIMATION_CONFIG } from "@/config/animation";
import { PLACEHOLDER_IMAGE_SQUARE } from "@/constants/common";
import type { SingleAds } from "@/types/api-schema/response";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";

export const ADS_ANIMATION_DELAY_MULTIPLIER = 0.03;

function AdsSection({
  isShowTitle = true,
  allAds,
}: {
  isShowTitle?: boolean;
  allAds: SingleAds[];
}) {
  const { t } = useTranslation();
  const handleAdClick = (ad: SingleAds) => {
    if (ad.url) window.open(ad.url, "_blank");
  };

  return (
    <div className="space-y-4">
      {isShowTitle && (
        <h2 className="text-forground font-semibold">
          {t("common.popularApps")}
        </h2>
      )}
      <div className="grid grid-cols-5 gap-3">
        {allAds.map((ad, index) => (
          <motion.div
            key={`${ad.id}-${index}`}
            initial={COMMON_ANIMATION_CONFIG.videoCard.initial}
            animate={COMMON_ANIMATION_CONFIG.videoCard.animate}
            transition={{
              ...COMMON_ANIMATION_CONFIG.videoCard.transition,
              delay: index * ADS_ANIMATION_DELAY_MULTIPLIER,
            }}
            onClick={() => handleAdClick(ad)}
            className="flex flex-shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg"
          >
            <img
              src={ad.image ?? PLACEHOLDER_IMAGE_SQUARE}
              alt={ad.title}
              className="aspect-square rounded-lg object-contain"
            />
            <p className="text-xs font-medium text-white">{ad.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AdsSectionSkeleton() {
  return (
    <section className="space-y-4">
      <Skeleton className="mx-4 h-6 w-32" />
      <div className="grid grid-cols-5 gap-3 px-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            initial={COMMON_ANIMATION_CONFIG.videoCard.initial}
            animate={COMMON_ANIMATION_CONFIG.videoCard.animate}
            transition={{
              ...COMMON_ANIMATION_CONFIG.videoCard.transition,
              delay: index * ADS_ANIMATION_DELAY_MULTIPLIER,
            }}
            className="flex w-full cursor-pointer flex-col items-center justify-center space-y-1.5"
          >
            <Skeleton className="aspect-square w-full overflow-hidden rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export { AdsSection, AdsSectionSkeleton };
