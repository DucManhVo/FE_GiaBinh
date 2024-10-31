import { configAppView } from "zmp-sdk";
//Đổi màu thanh trạng thái khi dùng app
export function matchStatusBarColor(visible: boolean) {
  if (visible) {
    configAppView({
      statusBarType: "transparent",
      headerTextColor: "white",
    });
  } else {
    configAppView({
      statusBarType: "transparent",
      headerTextColor: "black",
    });
  }
}
