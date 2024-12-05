import React, { Suspense, useState, useEffect, useLayoutEffect } from "react";
import { FC } from "react";
import { openWebview } from "zmp-sdk/apis";
import { Card, Swiper, Skeleton, Space } from "antd-mobile";
import axios from "axios";
import { getConfig } from "utils/config";

//Dùng API thì xoá dòng này
import Response from "../../data/botBannerData.json";

const mainColor = getConfig((c) => c.template.primaryColor);
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

export const BotBannerContent: FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch mock data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Replace this with an actual API call if needed

  //     const response = await axios.get(
  //       "https://jsonplaceholder.typicode.com/photos?_limit=3"
  //     );
  //     setBanners(response.data);
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const data = Response.map((item) => ({
      id: item.id,
      url: item.url,
      title: item.title,
      thumbnailUrl: item.thumbnailUrl,
    }));
    setBanners(data);
    setLoading(false);
  }, []);

  return (
    <Swiper indicator={() => null} slideSize={80} autoplay loop>
      {banners.map((banner) => (
        <Swiper.Item key={banner.id}>
          <Card style={{ margin: "4px", border: "none", boxShadow: "none" }}>
            <img
              src={banner.url}
              alt={banner.title}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
              onClick={() => openUrlInWebview(banner.thumbnailUrl)}
            />
            <Space direction="vertical" style={{ padding: "16px" }}>
              <h3>{banner.title}</h3>
            </Space>
          </Card>
        </Swiper.Item>
      ))}
    </Swiper>
  );
};

export const BotBanner: FC = () => {
  return (
    <Suspense>
      <BotBannerContent />
    </Suspense>
  );
};
