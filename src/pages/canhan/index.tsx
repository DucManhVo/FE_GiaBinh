import React, { Suspense, useCallback, useEffect, useState } from "react";
import { FC } from "react";

import { replace84 } from "../../utils/short-function";
import {
  Avatar,
  Box,
  Button,
  Header,
  Icon,
  List,
  Page,
  Spinner,
  Text,
  useNavigate,
} from "zmp-ui";
//import { QRCodeSVG } from "qrcode.react";
import {
  authorize,
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
} from "zmp-sdk";

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
      <Spinner visible />
      <Box mt={6}>
        <Text.Title>Đang tải</Text.Title>
      </Box>
    </Box>
  );
};

const UserPageContent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { Item } = List;
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [sdt, setSdt] = useState("");
  const [avatar, setAvatar] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const fetchData = useCallback(async (accessToken) => {
    try {
      const { userInfo } = await getUserInfo({});
      setUserID(userInfo.id);
      setUserName(userInfo.name);
      setAvatar(userInfo.avatar);

      const data = await getPhoneNumber();
      const token = data?.token;
      if (token) {
        const requestOptions = {
          method: "POST",
          redirect: "follow" as RequestRedirect,
        };
        const url = `https://testsoft.tayninh.gov.vn/api/CongDan/GetPhoneNumberByToken?accessToken=${accessToken}&token=${token}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        if (result.success) {
          setSdt(replace84(result.data.data.number));
          const apiURL = `https://testsoft.tayninh.gov.vn/api/CongDan/GetMiniAppUserInfo?UserID=${
            userInfo.id
          }&Name=${userInfo.name}&Avatar=${
            userInfo.avatar
          }&DienThoai=${replace84(result.data.data.number)}&OAID=${
            userInfo.idByOA
          }`;
          // console.log(apiURL);
          const apiResponse = await fetch(apiURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const apiResult = await apiResponse.json();
          console.log("API Result:", apiResult);
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
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchAcessToken();
  }, [fetchData]);

  return (
    <div>
      {loading ? (
        <LoadingContent />
      ) : (
        <Page className="bg-white transition-all ease-out flex-none">
          <Box mt={4} style={{ textAlign: "center", backgroundColor: "white" }}>
            <Avatar story="default" src={avatar} />
            <p style={{ fontSize: "15px", marginTop: "4px" }}>{userName}</p>
          </Box>
          <List>
            <Item
              title="Họ và tên"
              prefix={
                <Icon style={{ fontSize: "27px" }} icon="zi-user-circle" />
              }
              suffix={<p style={{ fontSize: "15px" }}>{userName}</p>}
            />
            <Item
              title="Ngày sinh"
              prefix={<Icon style={{ fontSize: "27px" }} icon="zi-calendar" />}
              suffix={<p style={{ fontSize: "15px" }}></p>}
            />
            <Item
              title="Căn cước công dân"
              prefix={
                <Icon style={{ fontSize: "27px" }} icon="zi-info-circle" />
              }
              suffix={<p style={{ fontSize: "15px" }}></p>}
            />
            <Item
              title="Số điện thoại"
              prefix={<Icon style={{ fontSize: "27px" }} icon="zi-call" />}
              suffix={<p style={{ fontSize: "15px" }}>{sdt}</p>}
            />
          </List>
          <Box
            style={{
              textAlign: "center",
              marginTop: "10px",
            }}
          ></Box>
        </Page>
      )}
    </div>
  );
};

export const UserPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        showBackIcon={false}
        // backIcon={<Icon icon="zi-arrow-left" />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Thông tin cá nhân"
      />
      <Suspense>
        <UserPageContent />
      </Suspense>
    </Page>
  );
};
