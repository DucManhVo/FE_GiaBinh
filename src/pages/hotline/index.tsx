import React, { Suspense, useCallback } from "react";
import { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getConfig } from "utils/config";

import {
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
import { openPhone } from "zmp-sdk";
import { DotLoading, Toast } from "antd-mobile";

const { Item } = List;
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
      <div style={{ color: mainColor }}>
        <DotLoading color={mainColor} />
        <span>Đang tải</span>
      </div>
    </Box>
  );
};

const ListHotLineContent: FC = () => {
  const navigate = useNavigate();
  const openCallScreen111 = async () => {
    try {
      await openPhone({
        phoneNumber: "111",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreen112 = async () => {
    try {
      await openPhone({
        phoneNumber: "112",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreen113 = async () => {
    try {
      await openPhone({
        phoneNumber: "113",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreen114 = async () => {
    try {
      await openPhone({
        phoneNumber: "114",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreen115 = async () => {
    try {
      await openPhone({
        phoneNumber: "115",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreenPAHT = async () => {
    try {
      await openPhone({
        phoneNumber: "02373900900",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreenMT = async () => {
    try {
      await openPhone({
        phoneNumber: "19006769",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreenXD = async () => {
    try {
      await openPhone({
        phoneNumber: "02763814077",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreenDL = async () => {
    try {
      await openPhone({
        phoneNumber: "19006769",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  const openCallScreenDVC = async () => {
    try {
      await openPhone({
        phoneNumber: "02373900900",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  return (
    <Box className="bg-white transition-all ease-out flex-none">
      <Text className="warp-khancap">Khẩn cấp</Text>
      <List>
        <Item
          title="Bảo vệ trẻ em"
          suffix={
            <span
              onClick={() => {
                openCallScreen111();
              }}
              style={{ color: "#FC5151", fontSize: "18px" }}
            >
              <Icon icon="zi-call-solid" />
              111
            </span>
          }
        />
        <Item
          title="Tìm kiếm, cứu nạn"
          suffix={
            <span
              onClick={() => {
                openCallScreen112();
              }}
              style={{ color: "#FC5151", fontSize: "18px" }}
            >
              <Icon icon="zi-call-solid" />
              112
            </span>
          }
        />
        <Item
          title="Công an"
          suffix={
            <span
              onClick={() => {
                openCallScreen113();
              }}
              style={{ color: "#FC5151", fontSize: "18px" }}
            >
              <Icon icon="zi-call-solid" />
              113
            </span>
          }
        />
        <Item
          title="Cứu hoả"
          suffix={
            <span
              onClick={() => {
                openCallScreen114();
              }}
              style={{ color: "#FC5151", fontSize: "18px" }}
            >
              <Icon icon="zi-call-solid" />
              114
            </span>
          }
        />
        <Item
          title="Cấp cứu y tế"
          suffix={
            <span
              onClick={() => {
                openCallScreen115();
              }}
              style={{ color: "#FC5151", fontSize: "18px" }}
            >
              <Icon icon="zi-call-solid" />
              115
            </span>
          }
        />
      </List>
      <Text className="warp-khancap">Đời sống xã hội</Text>

      <Item
        title="Dịch vụ công"
        suffix={
          <span
            onClick={() => {
              openCallScreenPAHT();
            }}
            style={{ color: "#2288FF", fontSize: "18px" }}
          >
            <Icon icon="zi-call-solid" />
            02373 900 900
          </span>
        }
      />
      <List>
        <Item
          title="Điện lực"
          suffix={
            <span
              onClick={() => {
                openCallScreenMT();
              }}
              style={{ color: "#2288FF", fontSize: "18px" }}
            >
              <Icon icon="zi-call-solid" />
              19006769
            </span>
          }
        />
      </List>
    </Box>
  );
};

export const ListHotLinePage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Đường dây nóng"
      />
      <Suspense>
        <ListHotLineContent />
      </Suspense>
    </Page>
  );
};
