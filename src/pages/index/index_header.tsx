import React, { FC } from "react";
import { Box, Header, Text } from "zmp-ui";
import { getConfig } from "utils/config";
import logo from "../../static/mainlogo.png";

const mainColor = getConfig((c) => c.template.primaryColor);
const mainTitleApp = getConfig((c) => c.app.title);

const IndexHeader: FC = () => {
  return (
    <Header
      className="app-header no-border pl-4 flex-none pb-[6px]"
      style={{
        background: mainColor,
        color: "#fff",
      }}
      showBackIcon={false}
      title={
        (
          <Box flex alignItems="center" className="space-x-2">
            <img className="w-10 h-10 rounded-lg border-inset" src={logo} />
            <Box>
              <Text.Title size="small">{mainTitleApp}</Text.Title>
              <Text size="xxSmall" color="#fff">
                Mô tả cho ứng dụng bất kỳ ....
              </Text>
            </Box>
          </Box>
        ) as unknown as string
      }
    />
  );
};

export default IndexHeader;
