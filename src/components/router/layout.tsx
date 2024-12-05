import React, { FC } from "react";
import { Route } from "react-router";
import { Box, AnimationRoutes } from "zmp-ui";
import { Navigation } from "../navigation";
import { getSystemInfo } from "zmp-sdk";
import { ScrollRestoration } from "./scroll-restoration";
import HomePage from "pages/index";
import { UserPage } from "pages/canhan";
import { CaiDatPage } from "pages/caidat";
import { ThongBaoPage } from "pages/thongbao";
import { DatLichPage } from "pages/datlich";
import { TaoCuocHenPage } from "pages/datlich/taocuochen";
import { ListHotLinePage } from "pages/hotline";
import { QRinfoPage } from "pages/qrinfo";
import { HoiDapPage } from "pages/hoidap/";
import { TaoCauHoiPage } from "pages/hoidap/taocauhoi";
import { ChiTietHoiDapPage } from "pages/hoidap/chitiethoidap";
import { LichSuPage } from "pages/hoidap/lichsuhoidap";
import { ChiTietLichSuHoiDapPage } from "pages/hoidap/chitietlichsuhoidap";
import { TraCuuHoSoPage } from "pages/tracuuhoso";
import { TraCuuHoSoChiTietPage } from "pages/tracuuhoso/dvc-tracuutinhtranghoso-chitiet";
import { TraCuuThuTucPage } from "pages/nophoso";
import { ChiTietThuTucPage } from "pages/nophoso/chitiethutuc";
import { HoanTatPage } from "pages/nophoso/hoantat";
if (getSystemInfo().platform === "android") {
  const androidSafeTop = Math.round(
    (window as any).ZaloJavaScriptInterface.getStatusBarHeight() /
      window.devicePixelRatio
  );
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`
  );
}

export const Layout: FC = () => {
  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <AnimationRoutes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/canhan/" element={<UserPage />}></Route>
          <Route path="/caidat/" element={<CaiDatPage />}></Route>
          <Route path="/thongbao/" element={<ThongBaoPage />}></Route>
          <Route path="/datlich/" element={<DatLichPage />}></Route>
          <Route
            path="/datlich/taocuochen"
            element={<TaoCuocHenPage />}
          ></Route>
          <Route path="/hotline/" element={<ListHotLinePage />}></Route>
          <Route path="/qrinfo/" element={<QRinfoPage />}></Route>
          <Route path="/hoidap" element={<HoiDapPage />}></Route>
          <Route path="/hoidap/taocauhoi" element={<TaoCauHoiPage />}></Route>
          <Route
            path="/hoidap/chitiethoidap"
            element={<ChiTietHoiDapPage />}
          ></Route>
          <Route path="/hoidap/lichsuhoidap" element={<LichSuPage />}></Route>
          <Route
            path="/hoidap/chitietlichsuhoidap"
            element={<ChiTietLichSuHoiDapPage />}
          ></Route>
          <Route path="/tracuuhoso" element={<TraCuuHoSoPage />}></Route>
          <Route
            path="/tracuuhoso/dvc-tracuutinhtranghoso-chitiet"
            element={<TraCuuHoSoChiTietPage />}
          ></Route>
          <Route path="/nophoso" element={<TraCuuThuTucPage />}></Route>
          <Route
            path="/nophoso/chitietthutuc"
            element={<ChiTietThuTucPage />}
          ></Route>
          <Route path="/nophoso/hoantat" element={<HoanTatPage />}></Route>
        </AnimationRoutes>
      </Box>
      <Navigation />
    </Box>
  );
};
