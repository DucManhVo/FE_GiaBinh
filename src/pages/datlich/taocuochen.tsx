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

const TaoCuocHenPageContent: FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [lichHen, setLichHen] = useState({
    name: "",
    phone: "",
    address: "",
    noidung: "",
    description: "",
    date: selectedDate,
    time: selectedTime,
  });
  const [accessToken, setAccessToken] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [sdt, setSdt] = useState("");
  const [avatar, setAvatar] = useState("");

  const fetchData = useCallback(async (accessToken) => {
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      setUserID(userInfo.id);
      setUserName(userInfo.name);
      setAvatar(userInfo.avatar);
      setLichHen({ ...lichHen, name: userInfo.name });

      const data = await getPhoneNumber();
      const token = data?.token;
      if (token) {
        const requestOptions = {
          method: "POST",
          redirect: "follow" as RequestRedirect,
        };
        const url = `https://giabinhso.tayninh.gov.vn/api/UserInfoMiniApp/GetPhoneNumberByToken?accessToken=${accessToken}&token=${token}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        if (result.success) {
          setSdt(replace84(result.data.data.number));

          // const apiURL = `https://hoidap.tayninh.gov.vn/api/CongDan/GetMiniAppUserInfo?UserID=${
          //   userInfo.id
          // }&Name=${userInfo.name}&Avatar=${
          //   userInfo.avatar
          // }&DienThoai=${replace84(result.data.data.number)}&OAID=${
          //   userInfo.idByOA
          // }`;
          // // console.log(apiURL);
          // const apiResponse = await fetch(apiURL, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          // });
          // const apiResult = await apiResponse.json();
          // console.log("API Result:", apiResult);
        } else {
          console.error("Failed to get phone number:", result.message);
        }
      } else {
        console.error("Token is undefined");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const _getDataSDT = async (dienThoai) => {
    if (!dienThoai) return;
    setLichHen({ ...lichHen, phone: dienThoai });
  };

  useEffect(() => {
    if (sdt) {
      _getDataSDT(sdt);
    }
  }, [sdt]);

  useEffect(() => {
    const fetchAcessToken = async () => {
      try {
        const accesstoken = await getAccessToken();
        setAccessToken(accesstoken);
        fetchData(accesstoken);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAcessToken();
  }, [fetchData]);

  const showPopup = () => {
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const handleChange = (e) => {
    const newLichHen = { ...lichHen };
    newLichHen[e.target.id] = e.target.value;
    setLichHen(newLichHen);
  };

  const handleDateChange = (value) => {
    setSelectedDate(value.toISOString().split("T")[0]);
  };

  // const handleTimeChange = (e) => {
  //   setSelectedTime(e.target.value);
  // };

  const handleTimeChange = (value: string | undefined): void => {
    const safeValue = String(value || "");

    // Remove all characters except digits and colons
    let formattedValue = safeValue.replace(/[^0-9:]/g, "");

    // Automatically insert a colon if length is 2 and no colon exists
    if (formattedValue.length === 2 && !formattedValue.includes(":")) {
      formattedValue += ":";
    }

    // Limit input to HH:MM format and ensure max length is 5
    if (
      !/^([0-1][0-9]|2[0-3]):[0-5][0-9]?$/.test(formattedValue) &&
      formattedValue.length > 5
    ) {
      formattedValue = formattedValue.slice(0, 5);
    }

    setSelectedTime(formattedValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value.trim();
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(inputValue)) {
      Toast.show({
        content: "Vui lòng nhập giờ theo định dạng 00:00",
        duration: 2000,
      });

      setSelectedTime("");
    } else {
      setSelectedTime(inputValue);
    }
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
        selectedDate,
        selectedTime) != ""
      ) {
        const raw = JSON.stringify({
          name: lichHen.name,
          phone: lichHen.phone,
          address: lichHen.address,
          description: lichHen.description,
          date: `${selectedDate}T${selectedTime}`,
        }); // Ngăn chặn reload trang khi submit

        const requestOptions: any = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          "https://giabinhso.tayninh.gov.vn/api/Nukeviet/InsertLichHen",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));

        showPopup();
      } else {
        Toast.show("Vui lòng nhập đủ và đúng định dạng thông tin");
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
          value={lichHen.name}
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Họ tên"
          onChange={handleChange}
          className="zaui-list-item-subtitle"
          placeholder="Nhập họ tên"
        ></Input>
        <Input
          id="phone"
          value={lichHen.phone}
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
        <Input
          id="time"
          style={{ marginLeft: "16px", marginRight: "16px" }}
          suffix={<Icon icon="zi-clock-2" style={{ marginRight: "11px" }} />}
          label="Thời gian"
          value={selectedTime}
          placeholder="Nhập theo định dạng Giờ:Phút"
          onChange={(e) => handleTimeChange(e.target.value)}
          className="zaui-list-item-subtitle"
          onBlur={handleBlur}
          clearable
        />
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
