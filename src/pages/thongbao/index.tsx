import React, { Suspense, useEffect, useState } from "react";
import { getConfig } from "utils/config";
import { FC } from "react";
import { Space, Image } from "antd-mobile";
import axios from "axios";
import { formatDate } from "utils/short-function";
import icDeveloper from "../../static/developer.png";

//Dùng API thì xoá dòng này
import Response from "../../data/postData.json";

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

const ThongBaoPageContent = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching data from a fake API
    // axios
    //   .get("https://jsonplaceholder.typicode.com/posts?_limit=3")
    //   .then((response) => {
    //     console.log(typeof response);
    //     // Assuming the API returns an array of objects with title, body (as description), and userId (as name)
    //     const data = response.data.map((item) => ({
    //       title: item.title,
    //       description: item.body,
    //       name: `User ${item.userId}`, // Mocking a name based on userId
    //     }));
    //     setItems(data);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //     setLoading(false);
    //   });
    //==============================================================
    //Set data từ json file thì dùng đoạn này
    const data = Response.map((item) => ({
      title: item.title,
      description: item.body,
      name: `User ${item.userId}`, // Mocking a name based on userId
    }));
    setItems(data);
    setLoading(false);
  }, []);
  //=======================================
  return (
    <>
      <Box
        className="bg-white transition-all ease-out flex-none"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "200px", height: "200px" }}>
          <img src={icDeveloper} alt="" />
        </div>
        <p>Chức năng đang được phát triển</p> <br></br>
      </Box>
    </>
    // <div>
    //   {loading ? (
    //     <LoadingContent />
    //   ) : (
    //     <List>
    //       {items.map((item, index) => (
    //         <List.Item key={index}>
    //           <Space direction="vertical" align="start">
    //             <div style={{ display: "flex", alignItems: "center" }}>
    //               <Icon
    //                 style={{
    //                   marginRight: "10px",
    //                   color: mainColor,
    //                   borderRadius: "50%",
    //                 }}
    //                 icon="zi-stranger"
    //               />
    //               &nbsp;
    //               <strong style={{ flex: 1, fontSize: 16 }}>
    //                 {item.title}
    //               </strong>
    //             </div>
    //             {/* <div>{item.description}</div> */}
    //             <div>
    //               <Icon style={{ color: mainColor }} size={18} icon="zi-user" />
    //               &nbsp;
    //               <em>{item.name}</em>
    //               &emsp;
    //               <Icon
    //                 size={18}
    //                 style={{ color: mainColor }}
    //                 icon="zi-clock-1"
    //               />
    //               &nbsp;
    //               <em>Thời gian</em>
    //             </div>
    //           </Space>
    //         </List.Item>
    //       ))}
    //     </List>
    //   )}
    // </div>
  );
};

export const ThongBaoPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        showBackIcon={false}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Thông báo"
      />
      <Suspense>
        <ThongBaoPageContent />
      </Suspense>
    </Page>
  );
};
