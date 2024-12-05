import React, { Suspense, useEffect, useState, useCallback } from "react";
import { getConfig } from "utils/config";
import { FC } from "react";
import { Space, Image, DotLoading } from "antd-mobile";
import axios from "axios";
import { formatDate, getDate, getTime, replace84 } from "utils/short-function";
import icHistory from "../../static/history.png";
import {
  chooseImage,
  getUserInfo,
  getAccessToken,
  getPhoneNumber,
  authorize,
  getSetting,
} from "zmp-sdk/apis";
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
  const [sdt, setSdt] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const _getData = async (dienThoai) => {
    if (!dienThoai) return;
    setLoading(true);
    try {
      axios
        .get(
          "https://giabinhso.tayninh.gov.vn/api/Nukeviet/GetLichHenByPhone?Phone=" +
            dienThoai
        )
        .then((response) => {
          // Assuming the API returns an array of objects with title, body (as description), and userId (as name)
          const data = response.data.data.map((item) => ({
            date: formatDate(getDate(item.date)),
            time: getTime(item.date),
            name: item.name,
            address: item.address,
            description: item.description,
            status: item.status,
            lyDo: item.lyDo,
          }));
          setLichHen(data);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const _getSDT = useCallback(async (accessToken) => {
    try {
      const data = await getPhoneNumber();
      const token = data?.token;
      if (token) {
        const requestOptions = {
          method: "POST",
          redirect: "follow" as RequestRedirect,
        };
        console.log(token);
        console.log(accessToken);
        const url = `https://giabinhso.tayninh.gov.vn/api/UserInfoMiniApp/GetPhoneNumberByToken?accessToken=${accessToken}&token=${token}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        setSdt(replace84(result.data.data.number));
        console.log(result);
      } else {
        console.error("Token is undefined");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    if (sdt) {
      _getData(sdt);
    }
  }, [sdt]);

  useEffect(() => {
    const fetchAcessToken = async () => {
      try {
        const accesstoken = await getAccessToken();

        setAccessToken(accesstoken);
        _getSDT(accesstoken);
        //setLoading(false);
      } catch (error) {
        console.log(error);
        //setLoading(false);
      }
    };
    fetchAcessToken();
  }, [_getSDT]);

  if (!lichhen.length && loading) {
    return <LoadingContent />;
  } else if (!lichhen.length) {
    return (
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
    );
  } else {
    return (
      <div>
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
                    {item.status == 0
                      ? "Chấp thuận"
                      : item.status == 1
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
                  <em>
                    {item["lyDo"] && (
                      <p
                        style={{
                          color: "#FC5151",
                          fontSize: "0.8rem",
                          marginTop: "6px",
                          textAlign: "justify",
                        }}
                      >
                        Lý do huỷ: {item["lyDo"]}
                      </p>
                    )}
                  </em>
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
                  <Icon style={{ fontWeight: 550 }} size={16} icon="zi-post" />
                  &nbsp; Đặt lịch hẹn
                </Button>
              </div>
            </div>
          </div>
        </List>
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
