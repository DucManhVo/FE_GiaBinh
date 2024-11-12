import React, { Suspense, useEffect, useState } from "react";
import { getConfig } from "utils/config";
import { FC } from "react";
import { Space, Image, DotLoading } from "antd-mobile";
import axios from "axios";
import { getDate, getTime } from "utils/short-function";
import icHistory from "../../static/history.png";

//Dùng API thì xoá dòng này
import Response from "../../data/postData.json";

import {
  Box,
  Button,
  Header,
  Icon,
  List,
  Page,
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
      <div style={{ color: mainColor }}>
        <DotLoading color={mainColor} />
        <span>Đang tải</span>
      </div>
    </Box>
  );
};

const DatLichPageContent = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [lichhen, setLichHen] = useState<any[]>([]);

  useEffect(() => {
    //Fetching data from a fake API
    axios
      .get("https://localhost:44337/api/Nukeviet/GetLichHen")
      .then((response) => {
        // Assuming the API returns an array of objects with title, body (as description), and userId (as name)
        const data = response.data.data.map((item) => ({
          date: getDate(item.date),
          time: getTime(item.date),
          name: item.name,
          address: item.address,
          description: item.description,
          status: item.status,
        }));
        setLichHen(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
    //==============================================================
    //Set data từ json file thì dùng đoạn này
    // const data = Response.map((item) => ({
    //   title: item.title,
    //   description: item.body,
    //   name: `User ${item.userId}`, // Mocking a name based on userId
    // }));
    // setItems(data);
    // setLoading(false);
    //=======================================
  }, []);

  if (!lichhen.length) {
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
            <img src={icHistory} alt="" />
          </div>
          <p>Bạn chưa có cuộc hẹn nào, hãy đăt lịch</p> <br></br>
          <Button
            onClick={() => {
              navigate("/datlich/taocuochen", {
                replace: true,
              });
            }}
          >
            Đặt lịch hẹn
          </Button>
        </Box>
      </>
    );
  } else {
    return (
      <div>
        {loading ? (
          <LoadingContent />
        ) : (
          <List>
            {lichhen.map((item, index) => (
              <List.Item key={index}>
                <Space direction="vertical" align="start">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Icon
                      style={{
                        marginRight: "10px",
                        color: mainColor,
                        borderRadius: "50%",
                      }}
                      icon="zi-calendar"
                    />
                    &nbsp;
                    <strong
                      style={{ flex: 1, fontSize: 16 }}
                    >{`Có 1 cuộc hẹn ngày ${item.date} vào lúc ${item.time}`}</strong>
                  </div>
                  <div>{item.description}</div>
                  <div>
                    <Icon
                      style={{ color: mainColor }}
                      size={18}
                      icon="zi-auto-solid"
                    />
                    &nbsp;
                    <em>
                      {item.status == 1
                        ? "Chấp thuận"
                        : item.status == 2
                        ? "Từ chối"
                        : "Đang xử lý"}
                    </em>
                    &emsp;
                    <Icon
                      size={18}
                      style={{ color: mainColor }}
                      icon="zi-location"
                    />
                    &nbsp;
                    <em>{item.address}</em>
                  </div>
                </Space>
              </List.Item>
            ))}
            <div className="bottom-panel-wrapper">
              <div className="product-bottom-panel">
                <div className="product-bottom-panel__button-action">
                  <Button
                    htmlType="submit"
                    className="button-action"
                    size="medium"
                    onClick={() => {
                      navigate("/datlich/taocuochen");
                    }}
                  >
                    <Icon
                      style={{ fontWeight: 550 }}
                      size={16}
                      icon="zi-post"
                    />
                    &nbsp; Đặt lịch hẹn
                  </Button>
                </div>
              </div>
            </div>
          </List>
        )}
      </div>
    );
  }
};

export const DatLichPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Danh Sách Lịch Hẹn"
      />
      <Suspense>
        <DatLichPageContent />
      </Suspense>
    </Page>
  );
};
