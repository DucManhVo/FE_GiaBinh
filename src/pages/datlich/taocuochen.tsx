import React, { Suspense, useCallback, useState, useEffect } from "react";
import { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

import {
  Box,
  Header,
  Input,
  Icon,
  List,
  Page,
  Radio,
  Modal,
  Spinner,
  Text,
  useNavigate,
  Button,
  DatePicker,
  Picker,
} from "zmp-ui";
import { DotLoading, Toast } from "antd-mobile";

import { rgb } from "@react-spring/shared";
import {
  chooseImage,
  getUserInfo,
  getAccessToken,
  getPhoneNumber,
} from "zmp-sdk/apis";
import { divide, template } from "lodash";

import { any, array } from "prop-types";
import { replace84 } from "../../utils/short-function";
import { getConfig } from "utils/config";

const mainColor = getConfig((c) => c.template.primaryColor);

const LoadingContent = () => {
  return (
    <Box
      mt={6}
      flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <div style={{ color: mainColor }}>
        <DotLoading color={mainColor} />
        <span>Đang tải</span>
      </div>
    </Box>
  );
};
const TaoCuocHenPageContent: FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedTime, setSelectedTime] = useState<any>();
  const [popupVisible, setPopupVisible] = useState(false);
  const [lichHen, setLichHen] = useState({
    name: "",
    phone: "",
    address: "",
    noidung: "",
    description: "",
    date: selectedDate,
    time: "",
  });

  interface Option {
    value: number;
    displayName: string;
  }

  const genHour = (name, number, hour = "Giờ") => {
    const data: Option[] = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 7; i < number; i++) {
      data.push({
        value: i + 1,
        displayName: `${i + 1} ${hour}`,
      });
    }
    return data;
  };

  const genMiniute = (name, number, miniute = "Phút") => {
    const data: Option[] = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < number; i++) {
      data.push({
        value: i + 1,
        displayName: `${i + 1} ${miniute}`,
      });
    }
    return data;
  };

  const showPopup = () => {
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const handleChange = (e) => {
    const newLichHen = { ...lichHen };
    newLichHen[e.target.id] = e.target.value;
    //console.log(e.target.value);
    setLichHen(newLichHen);
  };

  const handleDateChange = (value) => {
    //console.log(value);
    setSelectedDate(value.toISOString().split("T")[0]);
  };

  const validateTime = (value) => {
    // Xóa ký tự không phải là số và dấu hai chấm
    let newValue = value.replace(/[^0-9:]/g, "");

    // Đảm bảo chỉ nhập tối đa 5 ký tự
    if (newValue.length > 5) {
      newValue = newValue.slice(0, 5);
    }

    // Tự động thêm dấu hai chấm khi nhập giờ/phút
    if (newValue.length === 2 && !newValue.includes(":")) {
      newValue = newValue + ":";
    }

    // Kiểm tra định dạng hh:mm hợp lệ
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timePattern.test(newValue) && newValue.length === 5) {
      Toast.show("Thời gian không hợp lệ.");
      newValue = "";
    }

    return newValue;
  };

  const handleTimeChange = (e) => {
    const validatedValue = validateTime(e.target.value);
    e.target.value = validatedValue; // Cập nhật lại giá trị đã được kiểm tra
    selectedTime(validatedValue);
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (
        (lichHen.name,
        lichHen.phone,
        lichHen.address,
        lichHen.description,
        lichHen.date,
        lichHen.time) != ""
      ) {
        const raw = JSON.stringify({
          name: lichHen.name,
          phone: lichHen.phone,
          address: lichHen.address,
          description: lichHen.description,
          date: selectedDate,
          time: lichHen.time,
        }); // Ngăn chặn reload trang khi submit

        const requestOptions: any = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          "https://localhost:44337/api/Nukeviet/InsertLichHen",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));

        showPopup();
      } else {
        Toast.show("Vui lòng nhập đủ thông tin");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };

  // ======================================
  return (
    <Page className="section-container">
      <form className="relative flex-1 flex flex-col" onSubmit={handleSubmit}>
        <Input
          id="name"
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Họ tên"
          onChange={handleChange}
          className="zaui-list-item-subtitle"
          placeholder="Nhập họ tên"
        ></Input>
        <Input
          id="phone"
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Số điện thoại"
          onChange={handleChange}
          className="zaui-list-item-subtitle"
          placeholder="Nhập số điện thoại"
        ></Input>
        <Input
          id="address"
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Địa chỉ"
          onChange={handleChange}
          className="zaui-list-item-subtitle"
          placeholder="Nhập địa chỉ"
        ></Input>
        <Input.TextArea
          id="description"
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Nội dung"
          onChange={handleChange}
          className="zaui-list-item-subtitle"
          placeholder="Nhập nội dung"
        ></Input.TextArea>
        <Box style={{ marginLeft: "16px", marginRight: "16px" }}>
          <DatePicker
            label="Ngày hẹn"
            mask
            maskClosable
            onChange={handleDateChange}
            dateFormat="dd-mm-yyyy"
            title="Ngày hẹn"
            placeholder="Nhập ngày"
            action={{
              text: "Xong",
              close: true,
            }}
          />
        </Box>
        {/* <Box style={{ marginLeft: "16px", marginRight: "16px" }}>
          <Picker
            label="Thời gian hẹn"
            placeholder="Nhập thời gian"
            mask
            maskClosable
            title="Nhập thời gian"
            action={{
              text: "Xong",
              close: true,
            }}
            // disabled
            data={[
              {
                options: genHour("key1", 17),
                name: "otp1",
              },
              {
                options: genMiniute("key2", 60),
                name: "otp2",
              },
            ]}
          />
        </Box> */}
        <Input
          id="time"
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Thời gian"
          suffix={<Icon icon="zi-clock-2" style={{ marginRight: "11px" }} />}
          onChange={handleChange}
          className="zaui-list-item-subtitle"
          placeholder="Nhập theo cú pháp Giờ:Phút"
        ></Input>
        <Button
          htmlType="submit"
          style={{
            marginLeft: "16px",
            marginRight: "16px",
            marginTop: "5px",
            color: "white",
            fontSize: "18px",
          }}
        >
          Gửi yêu cầu
        </Button>
      </form>
      <Modal
        title="Thông báo"
        description="Đã gửi yêu cầu"
        visible={popupVisible}
        onClose={hidePopup}
        maskClosable={false}
      >
        <Box>
          <Box p={6}>
            <Button
              style={{ backgroundColor: mainColor }}
              onClick={() =>
                navigate("/datlich", {
                  replace: true,
                })
              }
              fullWidth
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
};

export const TaoCuocHenPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Đặt lịch"
      />
      <Suspense>
        <TaoCuocHenPageContent />
      </Suspense>
    </Page>
  );
};
