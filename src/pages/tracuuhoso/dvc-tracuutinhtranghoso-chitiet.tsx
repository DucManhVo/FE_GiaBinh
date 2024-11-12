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

import { Box, Button, Header, Icon, Page, Text, useNavigate } from "zmp-ui";
const mainColor = getConfig((c) => c.template.primaryColor);
var requestOptions: any = {
  method: "POST",
  redirect: "follow",
};

const TraCuuHoSoChiTietPageContent = () => {
  // const user = useStore("user");
  //   const hoSoData = zmproute.query.hoSoInfo
  //     ? JSON.parse(zmproute.query.hoSoInfo)
  //     : null;
  //   const soBienNhan = zmproute.query.soBienNhan;

  const [dataHoSo, setHoSoData] = useState<any>(null);
  const toastHandler = useRef<any>();

  //   useEffect(() => {
  //     if (hoSoData) {
  //       setHoSoData(hoSoData);
  //     } else if (soBienNhan) {
  //       _traCuuThuTuc(soBienNhan);
  //     }
  //   }, []);

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
          icon={<Icon icon="zi-list-2" style={{ color: "#fff" }} />}
          title={dataHoSo.soBienNhan}
          style={{
            "--background-color": "#1843EF",
          }}
        >
          <List
            header=""
            style={{
              "--header-font-size": "14px",
            }}
          >
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

export const TraCuuHoSoPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Tra Cứu Hồ Sơ"
      />
      <Suspense>
        <TraCuuHoSoChiTietPageContent />
      </Suspense>
    </Page>
  );
};
