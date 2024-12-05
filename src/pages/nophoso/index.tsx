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
} from "antd-mobile";

import {
  getRouteParams,
  openWebview,
  getAccessToken,
  getPhoneNumber,
} from "zmp-sdk";

import { replace84 } from "../../utils/short-function";

import { TravelOutline } from "antd-mobile-icons";

import { Box, Button, Header, Icon, Page, Text, useNavigate } from "zmp-ui";
const mainColor = getConfig((c) => c.template.primaryColor);

const TraCuuThuTucPageContent = () => {
  const [dataTimKiem, setDataTimKiem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const toastHandler = useRef<any>();
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const navigate = useNavigate();

  const openUrlInWebview = (url: string) => {
    openWebview({
      url: url,
      config: {
        style: "normal",
        leftButton: "back",
      },
      success: (res) => {
        // xử lý khi gọi api thành công
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  };

  const requestOptions = {
    method: "POST",
    redirect: "follow" as RequestRedirect,
  };

  const _getPhoneNumberByToken = async (accessToken, token) => {
    return fetch(
      `https://giabinhso.tayninh.gov.vn/api/UserInfoMiniApp/GetPhoneNumberByToken?accessToken=${accessToken}&token=${token}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        toastHandler.current?.close();
        if (result.data.error === 0) {
          return result.data.data.number;
        } else return "0";
      })
      .catch((error) => console.log("error", error));
  };
  const handleInputChange = (value) => {
    // Clear the previous timeout
    clearTimeout(typingTimeout);

    // Set a new timeout
    const timeoutId = setTimeout(() => {
      // Perform the search operation using the query
      _traCuuThuTuc(value);
    }, 500); // Adjust the delay time as needed (e.g., 500 milliseconds)

    // Update the typingTimeout state
    setTypingTimeout(timeoutId);
  };

  const _traCuuThuTuc = (tukhoa) => {
    setDataTimKiem(null);
    if (tukhoa) {
      toastHandler.current = Toast.show({
        icon: "loading",
        content: "Đang tải",
        duration: 0,
        getContainer: document.getElementById("view-home"),
        maskClickable: false,
      });

      fetch(
        `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/TraCuuThuTuc?TuKhoa=${encodeURIComponent(
          tukhoa
        )}&LinhVucID=&MaCongDan=&DoiTuongID&NhomDoiTuongID=&CapThucHienID=&PageSize=20&PageIndex=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ", // Ensure you append the actual token here.
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setDataTimKiem(data.data);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          Toast.show({
            icon: "fail",
            content: "Lỗi tải dữ liệu",
          });
        })
        .finally(() => {
          toastHandler.current?.close();
        });
    }
  };

  return (
    <Page>
      <ResultPage
        icon={<TravelOutline />}
        status="success"
        title="TRA CỨU THỦ TỤC NỘP HỒ SƠ"
        style={{
          "--background-color": mainColor,
        }}
        description="Vui lòng nhập thông tin tên thủ tục hành chính muốn thực hiện và làm theo hướng dẫn"
      >
        &nbsp;
        <SearchBar
          style={{
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
          }}
          placeholder="Tìm kiếm thủ tục"
          onSearch={(value) => _traCuuThuTuc(value)}
          onClear={() => setDataTimKiem(null)}
          onChange={handleInputChange}
        />
        {dataTimKiem != null && dataTimKiem.length > 0 ? (
          <List
            header={"Tìm thấy " + dataTimKiem.length + " kết quả"}
            style={{
              "--header-font-size": "14px",
            }}
          >
            {dataTimKiem.map((item, index) => (
              <List.Item
                key={item.loaiHoSoID + index}
                title={item.tenLinhVuc}
                description={"Cấp thực hiện: " + item.capThucHien}
                onClick={() =>
                  navigate(
                    `chitietthutuc?loaiHoSoID=${item.loaiHoSoID}&linhVucID=${item.linhVucID}`,
                    {
                      // state: {
                      //   loaiHoSoID: item.loaiHoSoID,
                      //   linhVucID: item.linhVucID,
                      // },
                    }
                  )
                }
              >
                {index + 1 + ". " + item.tenLoaiHoSo}
              </List.Item>
            ))}
          </List>
        ) : dataTimKiem != null && dataTimKiem.length === 0 ? (
          <ErrorBlock
            status="empty"
            title="Không tìm thấy kết quả phù hợp"
            description="Hãy thử tìm kiếm lại với từ khoá khác."
          />
        ) : null}
      </ResultPage>
    </Page>
  );
};

export const TraCuuThuTucPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Tra Cứu Thủ Tục"
      />
      <Suspense>
        <TraCuuThuTucPageContent />
      </Suspense>
    </Page>
  );
};
