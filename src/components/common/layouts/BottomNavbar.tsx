import IconBookmarkActive from "@/assets/svgs/icon-bookmark-active.svg?react";
import IconBookmarkInactive from "@/assets/svgs/icon-bookmark-inactive.svg?react";
import IconHomeActive from "@/assets/svgs/icon-home-active.svg?react";
import IconHomeInactive from "@/assets/svgs/icon-home-inactive.svg?react";
import IconSettingsActive from "@/assets/svgs/icon-settings-active.svg?react";
import IconSettingsInactive from "@/assets/svgs/icon-settings-inactive.svg?react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

function BottomNavbar() {
  const { t } = useTranslation();
  const router = useRouter();
  function checkRouteActive(path: string) {
    if (path === "/") {
      return router.state.location.pathname === "/";
    }
    return router.state.location.pathname.startsWith(path);
  }
  const navItems = [
    {
      icon: {
        active: IconHomeActive,
        inactive: IconHomeInactive,
      },
      label: t("layout.navbar.home"),
      path: "/home",
    },
    {
      icon: {
        active: IconBookmarkActive,
        inactive: IconBookmarkInactive,
      },
      label: t("layout.navbar.bookmarks"),
      path: "/bookmarks",
    },
    {
      icon: {
        active: IconSettingsActive,
        inactive: IconSettingsInactive,
      },
      label: t("layout.navbar.settings"),
      path: "/settings",
    },
  ];
  return (
    <div className="bg-linear-to-t from-[#141416] to-[#1F1F1F] px-10 pt-2.5 pb-4">
      <div className="grid grid-cols-3 items-center gap-x-12">
        {navItems.map((item) => {
          const isActive = checkRouteActive(item.path);
          return (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to={item.path}
                className="flex flex-col items-center gap-y-1"
              >
                <motion.div
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {isActive ? (
                    <item.icon.active className="size-9" />
                  ) : (
                    <item.icon.inactive className="size-9" />
                  )}
                </motion.div>
                <motion.p
                  className="text-forground text-sm"
                  animate={{
                    color: isActive ? "#ffffff" : "#9ca3af",
                    fontWeight: isActive ? "600" : "400",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNavbar;
