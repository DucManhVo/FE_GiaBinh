import React, { Suspense, FC, useRef, useState } from "react";
import { getConfig } from "utils/config";
import { ResultPage, SearchBar, List, ErrorBlock, Toast } from "antd-mobile";

import { Box, Button, Header, Icon, Page, Text, useNavigate } from "zmp-ui";
const mainColor = getConfig((c) => c.template.primaryColor);
var requestOptions: any = {
  method: "POST",
  redirect: "follow",
};

const TraCuuHoSoPageContent = () => {
  const navigate = useNavigate();
  const [dataTimKiem, setDataTimKiem] = useState<any>(null);
  const toastHandler = useRef<any>();

  const _traCuuThuTuc = (tukhoa) => {
    if (tukhoa && tukhoa.length >= 9) {
      toastHandler.current = Toast.show({
        icon: "loading",
        content: "Đang tải",
        duration: 0,
        getContainer: document.getElementById("view-home"),
      });

      fetch(
        `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/TraCuuHoSo?SoBienNhan=${tukhoa}`,
        requestOptions
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setDataTimKiem(data.data);
          toastHandler.current?.close();
        });
    }
  };

  return (
    <Page name="dvc-tracuuhoso">
      <ResultPage
        icon={<Icon icon="zi-search" style={{ color: "#fff" }} />}
        status="success"
        title="TRA CỨU HỒ SƠ"
        style={{
          "--background-color": mainColor,
        }}
        description="Vui lòng nhập thông tin như: Số điện thoại, số căn cước công dân hoặc số biên nhận để thực hiện thao tác tra cứu hồ sơ đã nộp"
      >
        &nbsp;
        <SearchBar
          style={{
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
          }}
          placeholder="Số biên nhận hoặc số điện thoại hoặc số CMND"
          onSearch={(value) => _traCuuThuTuc(value)}
          onClear={() => setDataTimKiem(null)}
        />
        {dataTimKiem && dataTimKiem.length > 0 ? (
          <List
            header={"Tìm thấy " + dataTimKiem.length + " kết quả"}
            style={{
              "--header-font-size": "14px",
            }}
          >
            {dataTimKiem.map((item, index) => (
              <List.Item
                key={item.hoSoID + index}
                // clickable={true}
                title={item.nguoiDungTenHoSo}
                description={item.tenThuTuc + " - " + item.ngayNhan}
                onClick={() =>
                  navigate(
                    `/tracuuhoso/dvc-tracuutinhtranghoso-chitiet/?SoBienNhan=${item.soBienNhan}`,
                    {
                      replace: true,
                    }
                  )
                }
              >
                {item.soBienNhan}
              </List.Item>
            ))}
          </List>
        ) : dataTimKiem && dataTimKiem.length === 0 ? (
          <ErrorBlock
            status="empty"
            title="Không tìm thấy kết quả phù hợp"
            description="Hãy kiểm tra lại các thông tin đã nhập"
          />
        ) : null}
      </ResultPage>
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
        <TraCuuHoSoPageContent />
      </Suspense>
    </Page>
  );
};
