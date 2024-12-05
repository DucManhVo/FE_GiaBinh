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
const TaoCauHoiPageContent: FC = () => {
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [file, setFile] = useState<any>();
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [sdt, setSdt] = useState("");
  const [avatar, setAvatar] = useState("");
  const [cauHoi, setCauHoi] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [thongTin, setThongTin] = useState({
    hoten: "",
    sdt: "",
    tieude: "",
    noidung: "",
    filedinhkem: "",
    congkhai: "0",
  });

  // ===============================================

  const _getDataSDT = async (dienThoai) => {
    if (!dienThoai) return;
    setThongTin({ ...thongTin, sdt: dienThoai });
  };
  useEffect(() => {
    if (sdt) {
      _getDataSDT(sdt);
    }
  }, [sdt]);

  const fetchData = useCallback(async (accessToken) => {
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      setUserID(userInfo.id);
      setUserName(userInfo.name);
      setAvatar(userInfo.avatar);
      setThongTin({ ...thongTin, hoten: userInfo.name });

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
          // const apiURL = `https://giabinhso.tayninh.gov.vn/api/UserInfoMiniApp/GetMiniAppUserInfo?UserID=${
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

  // ======================================

  const showPopup = () => {
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  //Hien thi hinh anh da chon

  const handleChooseImage = async () => {
    try {
      const { filePaths, tempFiles } = await chooseImage({
        sourceType: ["album"],
        cameraType: "back",
        count: 1,
      });
      const [selectedFile] = filePaths;
      const blob = await (await fetch(selectedFile)).blob();
      const fileImage = new File([blob], "example.jpg", {
        type: "image/jpeg",
      });
      const objectURL = URL.createObjectURL(blob);
      setImageUrl(objectURL);
      setFile(fileImage);
      console.log(objectURL);
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImageUrl(null);
  };

  const myHeaders = new Headers();
  myHeaders.append("Cookie", "ASP.NET_SessionId=uitdywutharf1efswgb2blz3");

  // getUserInfo();

  const formdata = new FormData();

  const requestOptions: any = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  function Handle(e) {
    const newThongTin = { ...thongTin };
    newThongTin[e.target.id] = e.target.value;
    setThongTin(newThongTin);
    console.log(newThongTin);
  }

  function Submit(e) {
    e.preventDefault();
    if (
      (thongTin.hoten, thongTin.sdt, thongTin.tieude, thongTin.noidung) != ""
    ) {
      formdata.append("hoten", thongTin.hoten);
      formdata.append("sdt", thongTin.sdt);
      formdata.append("tieude", thongTin.tieude);
      formdata.append("noidung", thongTin.noidung);
      formdata.append("congkhai", thongTin.congkhai);
      formdata.append("filedinhkem", file);

      fetch(
        "https://hoidap.tayninh.gov.vn/HoiDapTrucTuyenServices.asmx/DatCauHoi",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

      showPopup();
    } else {
      Toast.show("Vui lòng nhập đủ thông tin");
    }
  }

  return (
    <Page className="section-container">
      <form
        className="relative flex-1 flex flex-col"
        onSubmit={(e) => Submit(e)}
      >
        <Input
          onChange={(e) => Handle(e)}
          id="hoten"
          value={thongTin.hoten}
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Họ tên"
          className="zaui-list-item-subtitle"
          placeholder="Nhập họ tên"
        ></Input>
        <Input
          onChange={(e) => Handle(e)}
          id="sdt"
          value={thongTin.sdt}
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Số điện thoại"
          className="zaui-list-item-subtitle"
          placeholder="Nhập số điện thoại"
        ></Input>
        <Input
          onChange={(e) => Handle(e)}
          id="tieude"
          value={thongTin.tieude}
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Tiêu đề"
          className="zaui-list-item-subtitle"
          placeholder="Nhập tiêu đề câu hỏi"
        ></Input>
        <Input.TextArea
          onChange={(e) => Handle(e)}
          id="noidung"
          value={thongTin.noidung}
          style={{ marginLeft: "16px", marginRight: "16px" }}
          label="Nội dung câu hỏi"
          className="zaui-list-item-subtitle"
          placeholder="Nhập nội dung câu hỏi"
        />
        <Box
          style={{ marginLeft: "16px", marginRight: "16px" }}
          className="zaui-list-item-subtitle"
        >
          <Radio.Group defaultValue={0}>
            <Radio
              onChange={(e) => Handle(e)}
              id="congkhai"
              value={1}
              size="small"
              style={{ marginRight: "5px" }}
              label="Công khai"
            />
            <Radio
              onChange={(e) => Handle(e)}
              id="congkhai"
              value={0}
              size="small"
              label="Không công khai"
            />
          </Radio.Group>

          <br />
          <label className="custom-file-upload" onClick={handleChooseImage}>
            <Icon icon="zi-photo-solid" />
            Chụp hoặc tải ảnh đính kèm
          </label>
          <br />
          <div className="image-upload-container">
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Preview" />
                <button className="remove-image" onClick={handleRemoveImage}>
                  ×
                </button>
              </div>
            )}
          </div>
        </Box>
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
          Gửi câu hỏi
        </Button>
      </form>
      <Modal
        title="Thông báo"
        description="Đã gửi câu hỏi"
        visible={popupVisible}
        onClose={hidePopup}
        maskClosable={false}
      >
        <Box>
          <Box p={6}>
            <Button
              style={{ backgroundColor: mainColor }}
              onClick={() =>
                navigate("/hoidap", {
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

export const TaoCauHoiPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Đặt câu hỏi"
      />
      <Suspense>
        <TaoCauHoiPageContent />
      </Suspense>
    </Page>
  );
};
