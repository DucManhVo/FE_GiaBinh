export type CategoryId =
  | "thongtinchinhquyen"
  | "qrinfo"
  | "duongdaynong"
  | "datlich"
  | "truyenhinh"
  | "radio"
  | "hoidap"
  | "phananhtingia"
  | "nophoso"
  | "tracuuhoso";

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  url: string;
  page: string;
}
