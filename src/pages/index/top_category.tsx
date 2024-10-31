import React, { useState } from "react";
import { FC } from "react";
import { openWebview } from "zmp-sdk/apis";
import { Box, Button, Modal, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { topCategories } from "state";
import { useNavigate } from "react-router";
import { getConfig } from "utils/config";

const mainColor = getConfig((c) => c.template.primaryColor);

const TopCategory: FC = () => {
  const categories = useRecoilValue(topCategories);
  const [showPopup, setShowPopup] = useState(false);
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
  // Hàm bật modal popup khi chưa hoàn thiện chức năng

  //   const handleItemClick = (category: any) => {
  //     if (category.id === "tintuc") {
  //       setShowPopup(true);
  //     } else if (category.url !== "") {
  //       openUrlInWebview(category.url);
  //     } else {
  //       navigate(category.page);
  //     }
  //   };
  return (
    <Box
      className="grid grid-cols-3 p-3"
      style={{
        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
      }}
    >
      {categories.map((category, i) => (
        <div
          key={i}
          // Hàm bật modal popup khi chưa hoàn thiện chức năng
          // onClick={() => handleItemClick(category)}
          onClick={() =>
            category.url != ""
              ? openUrlInWebview(category.url)
              : navigate(category.page)
          }
          className="flex flex-col space-y-2 items-center"
        >
          <img className="w-12 h-12" src={category.icon} />
          <Text
            size="xxSmall"
            style={{
              fontWeight: "bold",
              fontSize: "12.5px",
              lineHeight: "1.3",
            }}
            className="text-gray"
          >
            {category.name}
          </Text>
        </div>
      ))}
      {/* Modal Component */}
      <Modal
        visible={showPopup}
        title="Thông báo"
        onClose={() => {
          setShowPopup(false);
        }}
        description="Chức năng đang được phát triển!"
      >
        <Box p={6}>
          <Button
            style={{ backgroundColor: mainColor }}
            onClick={() => {
              setShowPopup(false);
            }}
            fullWidth
          >
            Đóng
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TopCategory;
