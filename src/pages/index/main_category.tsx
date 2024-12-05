import React, { useState } from "react";
import { FC } from "react";
import { openWebview } from "zmp-sdk/apis";
import { Box, Button, Modal, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { mainCategories } from "state";
import { useNavigate } from "react-router";
import { getConfig } from "utils/config";

const mainColor = getConfig((c) => c.template.primaryColor);

const MainCategory: FC = () => {
  const categories = useRecoilValue(mainCategories);
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
  const handleItemClick = (category: any) => {
    if (category.id === "nophoso") {
      setShowPopup(true);
    } else if (category.url !== "") {
      openUrlInWebview(category.url);
    } else {
      navigate(category.page);
    }
  };
  return (
    <Box className="bg-white grid grid-cols-4 gap-4">
      <div
        style={{ marginTop: "-5px", fontSize: "15px" }}
        className="font-semibold text-md mb-4 col-span-4 semibold border-b border-gray py-2"
      >
        Các chức năng chính
      </div>
      {categories.map((categories, i) => (
        <div
          key={i}
          //onClick={() => handleItemClick(categories)}
          onClick={() =>
            categories.url != ""
              ? openUrlInWebview(categories.url)
              : navigate(categories.page)
          }
          className="flex flex-col space-y-2 items-center"
        >
          <img className="h-14" src={categories.icon} />
          <Text
            size="xxSmall"
            style={{ fontWeight: "bold", fontSize: "12px", lineHeight: "1.3" }}
            className="text-gray"
          >
            {categories.name}
          </Text>
        </div>
      ))}
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

export default MainCategory;
