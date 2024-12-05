import React, { Suspense, FC, useRef, useState, useEffect } from "react";
import { getConfig } from "utils/config";
import {
  Steps,
  Form,
  Input,
  Picker,
  NoticeBar,
  ImageUploader,
  Result,
  Toast,
  Dialog,
  Space,
  ResultPage,
  SearchBar,
  List,
  ErrorBlock,
  Collapse,
} from "antd-mobile";

import {
  getRouteParams,
  openWebview,
  getAccessToken,
  getPhoneNumber,
} from "zmp-sdk";

import { replace84 } from "../../utils/short-function";

import { ContentOutline } from "antd-mobile-icons";

import { Box, Button, Header, Icon, Page, Text, useNavigate } from "zmp-ui";
const mainColor = getConfig((c) => c.template.primaryColor);

const ChiTietThuTucPageContent = () => {
  const loaiHoSoID = getRouteParams();
  const linhVucID = getRouteParams();
  const [dataChiTiet, setDataChiTiet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const toastHandler = useRef<any>();
  const navigate = useNavigate();

  useEffect(() => {
    _getChiTietThuTuc();
  }, []);

  const _getChiTietThuTuc = async () => {
    try {
      // Show loading toast
      toastHandler.current = Toast.show({
        icon: "loading",
        content: "Đang tải",
        duration: 0,
        getContainer: document.getElementById("view-home"),
        maskClickable: false,
      });

      // Fetch API data
      const response = await fetch(
        `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/ChiTietThuTuc?LoaiHoSoID=${loaiHoSoID.loaiHoSoID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer `, // Replace authToken with your token variable
          },
          body: JSON.stringify({}), // Ensure body matches API expectations
        }
      );

      // Parse response
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update state with the fetched data
      setDataChiTiet(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch ChiTietThuTuc:", error);

      // Show error message
      Toast.show({
        icon: "fail",
        content: "Đã xảy ra lỗi, vui lòng thử lại.",
        duration: 2000,
        getContainer: document.getElementById("view-home"),
      });
    } finally {
      // Close the loading toast
      toastHandler.current?.close();
    }
  };

  return (
    <Page>
      <ResultPage
        style={{
          "--background-color": mainColor,
        }}
        icon={<ContentOutline />}
        title="CHI TIẾT THỦ TỤC HÀNH CHÍNH"
        secondaryButtonText="Trở lại"
        onSecondaryButtonClick={() => navigate(-1)}
        onPrimaryButtonClick={() =>
          navigate(
            `/nophoso/hoantat?loaiHoSoID=${loaiHoSoID.loaiHoSoID}&linhVucID=${loaiHoSoID.linhVucID}`
          )
        }
        primaryButtonText="Nộp hồ sơ"
      >
        {dataChiTiet && (
          <List header="" style={{ marginTop: 12 }}>
            <Collapse defaultActiveKey={["1"]}>
              <Collapse.Panel key="1" title="Trình tự thực hiện">
                {dataChiTiet.trinhTu[0].trinhTu}
              </Collapse.Panel>
              <Collapse.Panel key="3" title="Thành phần hồ sơ">
                <List header="">
                  {dataChiTiet.thanhPhanHoSoGiayTo.map((item) => (
                    <List.Item
                      key={item.maGiayTo}
                      description={"Bản chính: " + item.soBanChinh}
                    >
                      {item.tenGiayTo}
                    </List.Item>
                  ))}
                </List>
              </Collapse.Panel>
            </Collapse>
          </List>
        )}
      </ResultPage>
    </Page>
  );
};

export const ChiTietThuTucPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Chi Tiết Thủ Tục"
      />
      <Suspense>
        <ChiTietThuTucPageContent />
      </Suspense>
    </Page>
  );
};
