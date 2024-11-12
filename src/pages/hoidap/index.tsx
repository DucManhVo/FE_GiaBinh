import React, {
  Suspense,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { getConfig } from "utils/config";
import { FC } from "react";
import { Space, Image, DotLoading } from "antd-mobile";
import axios from "axios";
import { formatDate, formatTimeStamp } from "utils/short-function";
import icHistory from "../../static/history.png";
import { ListRenderer } from "components/list-renderer";
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

const HoiDapPageContent = () => {
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [cauHoi, setCauHoi] = useState<any[]>([]);
  const [pageRows, setPageRows] = useState(15);
  const [hasMore, setHasMore] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const loader = useRef(null);

  const myHeaders = new Headers();
  myHeaders.append("Cookie", "ASP.NET_SessionId=iqgffpembxqx3pu4fjgagdjk");

  const requestOptions: any = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const fetchPosts = useCallback(
    async (pageIndex) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://hoidap.tayninh.gov.vn/HoiDapTrucTuyenServices.asmx/DanhSachCauHoi?pageRows=${pageRows}&pageIndex=${pageIndex}`,
          requestOptions
        );
        const result = await response.json();
        if (result.length > 0) {
          setCauHoi((prevPosts) => [...prevPosts, ...result]);
          setHasMore(result.length === pageRows);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [pageRows]
  );

  useEffect(() => {
    fetchPosts(pageIndex);
  }, [fetchPosts, pageIndex]);

  const fetchMoreData = () => {
    if (!isloading && hasMore) {
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
      if (entry.isIntersecting && hasMore) {
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
  }, [isloading, hasMore]);

  return (
    <Box
      style={{ marginBottom: "12%" }}
      className="relative flex-1 flex flex-col"
    >
      {cauHoi?.map((item, index) => (
        <ListRenderer
          key={item.Id}
          onClick={() => {
            navigate(`/hoidap/chitiethoidap/?id=${item.Id}`);
          }}
          items={[
            {
              left: <Icon style={{ color: mainColor }} icon="zi-stranger" />,
              right: (
                <>
                  <Box flex>
                    <Text.Header
                      style={{ marginTop: "-3px" }}
                      className="flex-1 items-center font-normal"
                    >
                      <p style={{ fontWeight: 500 }}>{item["TieuDeHoi"]}</p>
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
                            icon="zi-user"
                          />
                          &nbsp;
                          {item["HoVaTen"]}
                        </p>
                        <p
                          style={{
                            color: "#9DA0B0",
                            fontSize: "0.8rem",
                            marginTop: "6px",
                          }}
                        >
                          <Icon
                            size={16}
                            style={{ color: mainColor }}
                            icon="zi-clock-1-solid"
                          />
                          &nbsp;
                          {formatTimeStamp(item["ThoiGianHoi"])}
                        </p>
                      </div>
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

      {hasMore && (
        <div ref={loader} style={{ marginBottom: "10px" }}>
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
        </div>
      )}

      <div className="bottom-panel-wrapper">
        <div className="product-bottom-panel">
          <div className="product-bottom-panel__button-action">
            <span
              onClick={() => {
                navigate("/hoidap/taocauhoi");
              }}
              className="button-action-hoidap"
            >
              <Icon style={{ fontWeight: 550 }} size={17} icon="zi-post" />
              Đặt câu hỏi
            </span>
          </div>
          <div className="product-bottom-panel__button-action">
            <span
              onClick={() => {
                navigate(`/hoidap/lichsuhoidap`);
              }}
              className="button-action-history"
            >
              <Icon style={{ fontWeight: 550 }} size={17} icon="zi-memory" />
              Lịch sử
            </span>
          </div>
        </div>
      </div>
    </Box>
  );
};

export const HoiDapPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Danh Sách Câu Hỏi"
      />
      <Suspense>
        <HoiDapPageContent />
      </Suspense>
    </Page>
  );
};
