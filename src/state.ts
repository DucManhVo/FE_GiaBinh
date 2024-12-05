import { atom, selector } from "recoil";
import { getUserInfo } from "zmp-sdk";
import { Category, CategoryId } from "types/category";
import icAdd from "./static/add.png";
import icBooking from "./static/booking.png";
import icTv from "./static/ttv11logo.png";
import icRadio from "./static/fmlogo.png";
import icHotline from "./static/hotline.png";
import icQR from "./static/qrinfo.png";
import icInfo from "./static/info.png";
import icQa from "./static/q&a.png";
import icReport from "./static/report.png";
import icDoc from "./static/document.png";
import icSearch from "./static/search.png";

export const userState = selector({
  key: "user",
  get: () =>
    getUserInfo({
      avatarType: "normal",
    }),
});

export const displayNameState = atom({
  key: "displayName",
  default: "",
});

//Cấu hình 3 chức năng tiêu biểu
export const topCategories = selector<Category[]>({
  key: "top_category",
  get: () => [
    {
      id: "thongtinchinhquyen",
      name: "Thông tin chính quyền",
      icon: icInfo,
      url: "https://rd.zapps.vn/articles?pageId=2802088037247282112",
      page: "",
    },
    {
      id: "qrinfo",
      name: "Dữ liệu cá nhân",
      icon: icQR,
      url: "",
      page: "/qrinfo",
    },

    {
      id: "duongdaynong",
      name: "Đường dây nóng",
      icon: icHotline,
      url: "",
      page: "/hotline",
    },
  ],
});

//Cáu hình các chức năng chính
export const mainCategories = selector<any[]>({
  key: "main_category",
  get: () => [
    {
      id: "datlich",
      name: "Chức năng đặt lịch",
      icon: icBooking,
      url: "",
      page: "/datlich",
    },
    {
      id: "hoidap",
      name: "Hỏi đáp trực tuyến",
      icon: icQa,
      url: "",
      page: "/hoidap",
    },
    {
      id: "nophoso",
      name: "Nộp hồ sơ",
      icon: icDoc,
      url: "",
      page: "/nophoso",
    },
    {
      id: "tracuuhoso",
      name: "Tra cứu hồ sơ",
      icon: icSearch,
      url: "",
      page: "/tracuuhoso",
    },
    {
      id: "truyenhinh",
      name: "Truyền hình Tây Ninh",
      icon: icTv,
      url: "http://118.69.83.22:1935/ttv11/tntv/playlist.m3u8?typeInapp=1&zarsrc=260&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo",
      page: "",
    },
    {
      id: "radio",
      name: "Radio Online",
      icon: icRadio,
      url: "http://118.69.83.22:1935/radio11/tnradio/playlist.m3u8?typeInapp=1&zarsrc=260&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo",
      page: "",
    },
  ],
});
