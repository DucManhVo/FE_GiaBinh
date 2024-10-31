import React, { Suspense, useState } from "react";
import { FC } from "react";
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
import { createShortcut, openPhone } from "zmp-sdk";
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
      <Box mt={6}>
        <Text.Title>Đang tải</Text.Title>
      </Box>
    </Box>
  );
};

const CaiDatPageContent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const createMiniAppShortcut = async () => {
    try {
      await createShortcut({
        params: {
          utm_source: "shortcut",
        },
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };
  return (
    <div>
      {loading ? (
        <LoadingContent />
      ) : (
        <Box className="bg-white transition-all ease-out flex-none">
          <Text className="warp-khancap">Hệ thống</Text>
          <List>
            <Item
              onClick={() => {
                createMiniAppShortcut();
              }}
              title="Ghim ứng dụng ra màn hình chính"
              suffix={
                <span style={{ color: "#94a3b8;", fontSize: "18px" }}>
                  <Icon icon="zi-chevron-right" />
                </span>
              }
            />
          </List>
        </Box>
      )}
    </div>
  );
};

export const CaiDatPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        showBackIcon={false}
        // backIcon={<Icon icon="zi-arrow-left" />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Cài đặt"
      />
      <Suspense>
        <CaiDatPageContent />
      </Suspense>
    </Page>
  );
};
