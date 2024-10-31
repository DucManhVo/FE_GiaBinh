import React, { Suspense, useCallback, useEffect, useState } from "react";
import { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getConfig } from "utils/config";

import {
  Avatar,
  Box,
  Button,
  Header,
  Icon,
  List,
  Modal,
  Page,
  Spinner,
  Text,
  useNavigate,
} from "zmp-ui";
import { DotLoading, Toast } from "antd-mobile";
import { QRCodeSVG } from "qrcode.react";

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

const QRinfoContent: FC = () => {
  const navigate = useNavigate();
  const { Item } = List;
  const [cauHoi, setCauHoi] = useState<any[]>([]);
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [sdt, setSdt] = useState("");
  const [avatar, setAvatar] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  const Card = ({ icon, text, onClick }) => (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "45%",
        padding: "20px",
        margin: "7px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
      onClick={onClick}
    >
      <Icon style={{ fontSize: "27px", color: mainColor }} icon={icon} />
      <Text style={{ marginTop: "10px", fontSize: "15px" }}>{text}</Text>
    </Box>
  );

  const showPopup = () => {
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  return (
    <Page className="bg-white transition-all ease-out flex-none">
      <Box mt={4} style={{ textAlign: "center" }}>
        <Avatar story="default" src={avatar} />
        {/* <p style={{ fontSize: "15px", marginTop: "4px" }}>{userName}</p> */}
      </Box>
      <List>
        <Item
          title="Tên Zalo"
          prefix={<Icon style={{ fontSize: "27px" }} icon="zi-user-circle" />}
          suffix={<p style={{ fontSize: "15px" }}>{userName}</p>}
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
      >
        <Box>
          <QRCodeSVG
            style={{
              border: "1px solid",
              padding: "10px",
              color: mainColor,
            }}
            value={userID + "|" + userName + "|" + sdt}
            size={150}
          />
          <p
            style={{
              marginTop: "15px",
              fontSize: "16px",
              color: mainColor,
            }}
          >
            <i>Mã QR cá nhân</i>
          </p>
        </Box>
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            marginTop: "20px",
          }}
        >
          <Card icon="zi-inbox" text="Hồ sơ của tôi" onClick={showPopup} />
          <Card
            icon="zi-help-circle"
            text="Câu hỏi của tôi"
            onClick={showPopup}
          />
          <Card icon="zi-note" text="Biên lai điện tử" onClick={showPopup} />
          <Card icon="zi-gallery" text="Kết quả điện tử" onClick={showPopup} />
        </Box>
      </Box>
      <Modal
        title="Thông báo"
        description="Chức năng đang được phát triển!"
        visible={popupVisible}
        onClose={hidePopup}
        maskClosable={false}
      >
        <Box>
          <Box p={6}>
            <Button
              style={{ backgroundColor: mainColor }}
              onClick={hidePopup}
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

export const QRinfoPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Mã QR dữ liệu cá nhân"
      />
      <Suspense>
        <QRinfoContent />
      </Suspense>
    </Page>
  );
};
