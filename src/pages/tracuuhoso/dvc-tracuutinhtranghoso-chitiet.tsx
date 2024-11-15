import React, { Suspense, FC, useRef, useState, useEffect } from "react";
import { getConfig } from "utils/config";
import { ResultPage, SearchBar, List, ErrorBlock, Toast } from "antd-mobile";
import {
  ClockCircleOutline,
  CouponOutline,
  UserOutline,
  FileOutline,
  UnorderedListOutline,
  ScanCodeOutline,
} from "antd-mobile-icons";
import { getRouteParams } from "zmp-sdk";

import { Box, Button, Header, Icon, Page, Text, useNavigate } from "zmp-ui";
const mainColor = getConfig((c) => c.template.primaryColor);
var requestOptions: any = {
  method: "POST",
  redirect: "follow",
};

const TraCuuHoSoChiTietPageContent = () => {
  const [dataHoSo, setHoSoData] = useState<any>(null);
  const toastHandler = useRef<any>();
  const { SoBienNhan } = getRouteParams();

  useEffect(() => {
    console.log(SoBienNhan);
    _traCuuThuTuc(SoBienNhan);
  }, []);

  const _traCuuThuTuc = async (soBienNhan) => {
    toastHandler.current = Toast.show({
      icon: "loading",
      content: "Đang tải",
      duration: 0,
      getContainer: document.getElementById("view-home"),
    });

    return fetch(
      `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/TraCuuHoSo?SoBienNhan=${soBienNhan}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        setHoSoData(data.data[0]);
        toastHandler.current?.close();
      });
  };

  return (
    <Page name="dvc-tracuutinhtranghoso-chitiet">
      {dataHoSo && (
        <ResultPage
          icon={<ScanCodeOutline />}
          title={dataHoSo.soBienNhan}
          style={{
            "--background-color": mainColor,
          }}
        >
          <List header="">
            <List.Item
              prefix={<UserOutline />}
              extra={dataHoSo.nguoiDungTenHoSo}
            >
              Họ tên
            </List.Item>
            <List.Item prefix={<FileOutline />} extra={dataHoSo.tenThuTuc}>
              Thủ tục
            </List.Item>
            <List.Item
              prefix={<ClockCircleOutline />}
              extra={dataHoSo.ngayNhan}
            >
              Ngày tiếp nhận
            </List.Item>
            <List.Item
              prefix={<ClockCircleOutline />}
              extra={dataHoSo.ngayHentra}
            >
              Ngày hẹn trả
            </List.Item>
            <List.Item
              prefix={<UnorderedListOutline />}
              extra={dataHoSo.tenTinhTrang}
            >
              Tình trạng
            </List.Item>
            <List.Item prefix={<CouponOutline />} extra={dataHoSo.lePhi}>
              Lệ phí
            </List.Item>
            <List.Item prefix={<CouponOutline />} extra={dataHoSo.mucPhi}>
              Phí thẩm định
            </List.Item>
          </List>
        </ResultPage>
      )}
    </Page>
  );
};

export const TraCuuHoSoChiTietPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Tra Cứu Hồ Sơ Chi Tiết"
      />
      <Suspense>
        <TraCuuHoSoChiTietPageContent />
      </Suspense>
    </Page>
  );
};
