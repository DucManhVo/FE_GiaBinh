import React, {
  Suspense,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { getConfig } from "utils/config";
import { FC } from "react";
import { Space, Image, DotLoading, Toast } from "antd-mobile";
import axios from "axios";
import { openWebview } from "zmp-sdk/apis";
import { getRouteParams } from "zmp-sdk";
import { ListRenderer } from "components/list-renderer";
import parse from "html-react-parser";
import {
  formatDate,
  formatTimeStamp,
  getdata,
  replaceFile,
} from "utils/short-function";
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

const ChiTietLichSuHoiDapPageContent: FC = () => {
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
  const [chiTiet, setChiTiet] = useState([]);
  const [chiTietTL, setChiTietTL] = useState([]);
  const [fileTL, setFileTL] = useState("");
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rateValue, setRateValue] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { id } = getRouteParams();
  useEffect(() => {
    _getData();
    _getTL();
  }, []);
  const _getData = async () => {
    setIsLoading(true);
    const response = await (
      await getdata(
        "GET",
        "https://vms-ai.thanhhoa.gov.vn/HoiDapTrucTuyenServices.asmx/ChiTietCauHoi?id=" +
          id
      )
    )
      .json()
      .then((data) => {
        setChiTiet(data);
        console.log(data);
        setIsLoading(false);
        if (data[0].FileDinhkem) {
          setFile(replaceFile(data[0].FileDinhkem));
        } else {
          setFile("");
        }
      });
  };
  const _getTL = async () => {
    setIsLoading(true);
    const response = await (
      await getdata(
        "GET",
        "https://vms-ai.thanhhoa.gov.vn/HoiDapTrucTuyenServices.asmx/ChiTietCauTraLoi?id=" +
          id
      )
    )
      .json()
      .then((data) => {
        setChiTietTL(data);
        console.log(data);
        setIsLoading(false);
        if (data[0].FileDinhKem) {
          setFileTL(replaceFile(data[0].FileDinhKem));
        } else {
          setFileTL("");
        }
      });
  };

  const handleRateChange = (value) => {
    setRateValue(value);
    setIsModalVisible(true); // Show modal when rate changes
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <Box className="bg-white transition-all ease-out flex-none">
      {isLoading && <LoadingContent />}
      {chiTiet &&
        chiTiet.map((item, index) => (
          <ListRenderer
            items={[
              {
                left: false,
                right: (
                  <>
                    <Box flex>
                      <Text.Header className="flex-1 items-center font-normal">
                        <p
                          style={{
                            fontWeight: "500",
                            textAlign: "justify",
                            gap: "5px",
                            display: "flex",
                          }}
                        >
                          <Icon style={{ color: mainColor }} icon="zi-chat" />
                          {item["TieuDeHoi"] ? item["TieuDeHoi"] : ""}
                        </p>
                        <p className="flex-user">
                          &nbsp; &nbsp; &nbsp; &nbsp;
                          <Icon
                            style={{ color: mainColor }}
                            size={16}
                            icon="zi-user"
                          />
                          &nbsp; {item["HoVaTen"]}
                        </p>
                        <p className="flex-time">
                          <Icon
                            size={16}
                            style={{ color: mainColor }}
                            icon="zi-clock-1-solid"
                          />
                          &nbsp; {formatTimeStamp(item["ThoiGianHoi"])}
                        </p>
                        <hr
                          style={{ marginTop: "10px" }}
                          className="absolute left-0 -right-4 border-divider border-t-[0.5px]"
                        ></hr>
                        <br />
                        <p style={{ textAlign: "justify" }}>
                          {item["NoiDungHoi"] ? parse(item["NoiDungHoi"]) : ""}
                        </p>
                        <br />
                        <p
                          onClick={() => {
                            file == ""
                              ? Toast.show(`Không có file đính kèm`)
                              : openUrlInWebview(
                                  `https://vms-ai.thanhhoa.gov.vn${file}`
                                );
                          }}
                          style={{ textAlign: "justify", color: "blue" }}
                        >
                          <Icon icon="zi-file" />
                          File đính kèm (nếu có)
                        </p>
                      </Text.Header>
                    </Box>
                    <hr
                      style={{ marginTop: "10px" }}
                      className="absolute -left-4 -right-4 border-divider border-t-[10px]"
                    ></hr>
                    <br />
                    {chiTietTL &&
                      chiTietTL.map((itemTL, index) => (
                        <Box flex>
                          <Text.Header className="flex-1 items-center font-normal">
                            <p
                              style={{
                                fontWeight: "500",
                                textAlign: "justify",
                                gap: "5px",
                                display: "flex",
                                marginTop: "5px",
                              }}
                            >
                              <Icon
                                style={{ color: mainColor }}
                                icon="zi-bubble-multiselect"
                              />
                              {itemTL["TenDonVi"]} - trả lời
                            </p>

                            <p className="flex-reply">
                              <Icon
                                size={16}
                                style={{ color: mainColor }}
                                icon="zi-clock-1-solid"
                              />
                              &nbsp; {formatTimeStamp(itemTL["ThoiGianTraLoi"])}
                            </p>
                            <hr
                              style={{ marginTop: "10px" }}
                              className="absolute left-0 -right-4 border-divider border-t-[0.5px]"
                            ></hr>
                            <br />

                            <p style={{ textAlign: "justify" }}>
                              {itemTL["NoiDungTraLoi"]
                                ? parse(itemTL["NoiDungTraLoi"])
                                : ""}
                            </p>
                            <br />
                            <p
                              onClick={() => {
                                fileTL == ""
                                  ? Toast.show(`Không có file đính kèm`)
                                  : openUrlInWebview(
                                      `https://vms-ai.thanhhoa.gov.vn${fileTL}`
                                    );
                              }}
                              style={{ textAlign: "justify", color: "blue" }}
                            >
                              <Icon icon="zi-file" />
                              File đính kèm (nếu có)
                            </p>
                          </Text.Header>
                        </Box>
                      ))}
                  </>
                ),
              },
            ]}
            renderLeft={(item) => item.left}
            renderRight={(item) => item.right}
          />
          // );
        ))}
    </Box>
  );
};

export const ChiTietLichSuHoiDapPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Chi tiết câu hỏi"
      />
      <Suspense>
        <ChiTietLichSuHoiDapPageContent />
      </Suspense>
    </Page>
  );
};
