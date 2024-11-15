import React, { FC, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MenuItem } from "types/menu";
import { BottomNavigation, Icon } from "zmp-ui";

const tabs: Record<string, MenuItem> = {
  "/": {
    label: "Trang chủ",
    icon: <Icon icon="zi-home" />,
  },
  "/thongbao": {
    label: "Thông báo",
    icon: <Icon icon="zi-notif" />,
  },
  "/canhan": {
    label: "Cá nhân",
    icon: <Icon icon="zi-user-circle" />,
  },
  "/caidat": {
    label: "Cài đặt",
    icon: <Icon icon="zi-setting" />,
  },
};

export type TabKeys = keyof typeof tabs;

export const NO_BOTTOM_NAVIGATION_PAGES = [
  "/chucnangtieubieu1",
  "/qrinfo",
  "/hotline",
  "/datlich",
  "/datlich/taocuochen",
  "/datlich/lichsucuochen",
  "/hoidap",
  "/hoidap/chitiethoidap/",
  "/hoidap/taocauhoi",
  "/hoidap/lichsuhoidap",
  "/hoidap/chitietlichsuhoidap/",
  "/phananhtingia",
  "/nophoso",
  "/tracuuhoso",
  "/tracuuhoso/dvc-tracuutinhtranghoso-chitiet/",
  "/chucnang7",
];

export const Navigation: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKeys>("/");
  const navigate = useNavigate();
  const location = useLocation();
  const noBottomNav = useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (noBottomNav) {
    return <></>;
  }
  return (
    <BottomNavigation
      id="footer"
      activeKey={activeTab}
      onChange={(key: TabKeys) => setActiveTab(key)}
      className="z-50"
    >
      {Object.keys(tabs).map((path: TabKeys) => (
        <BottomNavigation.Item
          key={path}
          label={tabs[path].label}
          icon={tabs[path].icon}
          activeIcon={tabs[path].activeIcon}
          onClick={() => navigate(path)}
        />
      ))}
    </BottomNavigation>
  );
};
