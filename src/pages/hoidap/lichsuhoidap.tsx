import React, { Suspense, useEffect, useState, useRef } from "react";
import { getConfig } from "utils/config";
import { FC } from "react";
import { Space, Image, DotLoading } from "antd-mobile";
import axios from "axios";
import {
  chooseImage,
  getUserInfo,
  getAccessToken,
  getPhoneNumber,
} from "zmp-sdk/apis";
import { ListRenderer } from "components/list-renderer";
import { replace84, postLichSu } from "utils/short-function";
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

const LichSuPageContent = () => {
  const navigate = useNavigate();
  const [cauHoi, setCauHoi] = useState<any[]>([]);
  const [pageRows, setPageRows] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sdt, setSdt] = useState("");
  const loader = useRef(null);
  const [accessToken, setAccessToken] = useState("");
  const formatDate = (timestampString) => {
    const timestamp = parseInt(timestampString.match(/\d+/)[0]);
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  useEffect(() => {
    getAccessToken({
      success: (accesstoken) => {
        setAccessToken(accesstoken);
        getSDT(accesstoken);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    if (sdt) {
      _getData(sdt);
    }
  }, [pageIndex]);

  const _getData = async (dienThoai) => {
    if (!dienThoai) return;
    setIsLoading(true);
    try {
      const response = await postLichSu(
        "POST",
        "https://hoidap.tayninh.gov.vn/HoiDapTrucTuyenServices.asmx/DanhSachCauHoiByDienThoai",
        dienThoai,
        pageRows,
        pageIndex
      );
      const data = await response.json();
      // setCauHoi(data);
      if (data.length < pageRows) {
        setHasMore(false); // No more data to load
      }
      setCauHoi((prevData) => [...prevData, ...data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getSDT = async (accessToken) => {
    try {
      const data = await getPhoneNumber();
      const token = data?.token;
      if (token) {
        const requestOptions = {
          method: "POST",
          redirect: "follow" as RequestRedirect,
        };
        const url = `https://giabinhso.tayninh.gov.vn/api/UserInfoMiniApp/GetPhoneNumberByToken?accessToken=${accessToken}&token=${token}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        if (result.success) {
          const phoneNumber = replace84(result.data.data.number);
          console.log(phoneNumber);
          setSdt(phoneNumber);
          _getData(phoneNumber);
        } else {
          console.error("Failed to get phone number:", result.message);
        }
      } else {
        console.error("Token is undefined");
      }
    } catch (error) {
      console.error("Error fetching phone number:", error);
    }
  };
  const fetchMoreData = () => {
    // console.log("kéooooooo:");
    if (!isLoading && hasMore) {
      setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }
  };
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchMoreData();
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [isLoading, hasMore]);

  if (!cauHoi.length) {
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
          <p>Bạn chưa có câu hỏi nào</p> <br></br>
          <Button
            onClick={() => {
              navigate("/hoidap/taocauhoi");
            }}
          >
            Đặt câu hỏi
          </Button>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box
          style={{ marginBottom: "12%" }}
          className="relative flex-1 flex flex-col"
        >
          {cauHoi?.map((item, index) => (
            <ListRenderer
              onClick={() => {
                navigate(`/hoidap/chitiethoidap/?id=${item.Id}`);
              }}
              items={[
                {
                  left: (
                    <Icon style={{ color: mainColor }} icon="zi-stranger" />
                  ),
                  right: (
                    <>
                      <Box flex>
                        <Text.Header
                          style={{ marginTop: "-3px" }}
                          className="flex-1 items-center font-normal"
                        >
                          <p style={{ fontWeight: 500 }}>
                            {/* Tiêu đề hỏi */}
                            {item["TieuDeHoi"]}
                          </p>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <p
                              style={{
                                color: "#9DA0B0",
                                fontSize: "0.8rem",
                                marginTop: "6px",
                              }}
                            >
                              <Icon
                                style={{ color: mainColor }}
                                size={16}
                                icon="zi-clock-1-solid"
                              />
                              &nbsp;
                              {formatDate(item["ThoiGianHoi"])}
                            </p>
                            <p
                              style={{
                                color: "#9DA0B0",
                                fontSize: "0.8rem",
                                marginTop: "6px",
                              }}
                            >
                              {item["TinhTrang"] == 0
                                ? "Tiếp nhận"
                                : item["TinhTrang"] == 1
                                ? "Đang chờ trả lời"
                                : item["TinhTrang"] == 2
                                ? "Đã trả lời"
                                : item["TinhTrang"] == 3
                                ? "Vi phạm "
                                : "Trả về trung tâm điều phối"}
                            </p>
                          </div>
                          {item["LyDoVP"] && (
                            <p
                              style={{
                                color: "#FC5151",
                                fontSize: "0.8rem",
                                marginTop: "6px",
                                textAlign: "justify",
                              }}
                            >
                              Lý do huỷ: {item["LyDoVP"]}
                            </p>
                          )}
                          {item["GhiChu"] && (
                            <p
                              style={{
                                color: "#FC5151",
                                fontSize: "0.8rem",
                                marginTop: "6px",
                                textAlign: "justify",
                              }}
                            >
                              Lý do trả về: {item["GhiChu"]}
                            </p>
                          )}
                          <hr className="absolute left-0 -right-4 -bottom-4 border-divider border-t-[0.5px]"></hr>
                        </Text.Header>
                      </Box>
                    </>
                  ),
                },
              ]}
              renderLeft={(item) => item.left}
              renderRight={(item) => item.right}
            />
          ))}
          <div ref={loader} style={{ marginBottom: "10px" }}>
            {isLoading && hasMore && (
              <Box
                mt={6}
                flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <div style={{ color: "#F68A1E" }}>
                  <DotLoading color="#F68A1E" />
                  <span>Đang tải</span>
                </div>
              </Box>
            )}
          </div>
        </Box>
      </>
    );
  }
};

export const LichSuPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Lịch sử hỏi đáp"
      />
      <Suspense>
        <LichSuPageContent />
      </Suspense>
    </Page>
  );
};
