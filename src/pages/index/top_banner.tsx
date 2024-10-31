import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { openWebview } from "zmp-sdk";
import { Card } from "antd-mobile";
import axios from "axios";

//Dùng API thì xoá dòng này
import Response from "../../data/bannerData.json";

const openUrlInWebview = (url: string) => {
  openWebview({
    url: url,
    config: {
      style: "normal",
      leftButton: "back",
    },
    success: (res) => {},
    fail: (error) => {
      console.log(error);
    },
  });
};

const TopBanner = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Fetch mock data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Replace this with an actual API call if needed
  //     const response = await axios.get(
  //       "https://jsonplaceholder.typicode.com/photos?_limit=3"
  //     );
  //     setImages(response.data);
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const data = Response.map((item) => ({
      url: item.url,
      title: item.title,
      thumbnailUrl: item.thumbnailUrl,
    }));
    setImages(data);
    setLoading(false);
  }, []);

  return (
    <Swiper
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Navigation]}
      loop
    >
      {images.map((image) => (
        <SwiperSlide key={image.id}>
          <img
            onClick={() => openUrlInWebview(image.thumbnailUrl)}
            src={image.url}
            alt={image.alt}
            style={{ width: "100%", height: "240px", objectFit: "cover" }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TopBanner;
