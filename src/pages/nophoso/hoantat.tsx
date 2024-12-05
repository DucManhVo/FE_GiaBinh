import React, {
  Suspense,
  FC,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getConfig } from "utils/config";
import {
  Steps,
  Form,
  Input,
  Picker,
  NoticeBar,
  ImageUploader,
  Result,
  Toast,
  Dialog,
  Space,
  Button,
} from "antd-mobile";

import { PhoneFill } from "antd-mobile-icons";

import {
  getRouteParams,
  openWebview,
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
} from "zmp-sdk";

import { replace84 } from "../../utils/short-function";

import { Box, Header, Icon, Page, Text, useNavigate } from "zmp-ui";
const mainColor = getConfig((c) => c.template.primaryColor);

const HoanTatPageContent = () => {
  const navigate = useNavigate();
  const [sdt, setSdt] = useState("");
  const loaiHoSoID = getRouteParams();
  const [donvi, setDonVi] = useState(null);
  const { Step } = Steps;
  const [form] = Form.useForm();
  const toastHandler = useRef<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  // Cấp thực hiện
  const [capThucHien, setCapThucHien] = useState<any>([]);
  const [capThucHienPicker, setCapThucHienPicker] = useState(false);
  const [selectedCapThucHien, setSelectedCapThucHien] = useState(null);
  // Đơn vị thực hiện
  const [donViThucHien, setDonViThucHien] = useState<any>(null);
  const [donViThucHienPicker, setDonViThucHienPicker] = useState(false);
  const [selectedDonViThucHien, setSelectedDonViThucHien] = useState(null);
  // Đơn vị thực hiện con
  const [donViThucHienCon, setDonViThucHienCon] = useState<any>(null);
  const [donViThucHienConPicker, setDonViThucHienConPicker] = useState(false);
  const [selectedDonViThucHienCon, setSelectedDonViThucHienCon] =
    useState(null);
  // Thành phần kèm theo
  const [dsHoSoKemTheo, setDsHoSoKemTheo] = useState<any>(null);
  const [fileList, setFileList] = useState<any>(null);
  const [mucDo, setMucDo] = useState(null);
  const [visible, setVisible] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const accesstoken = await getAccessToken({});
        console.log("access token " + accesstoken);
        setAccessToken(accesstoken);
        fetchData(accesstoken);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAccessToken();
    console.log(loaiHoSoID);
    _getCapThucHien();
  }, []);

  const fetchData = useCallback(async (accessToken) => {
    try {
      //Lấy tên và avatar
      const { userInfo } = await getUserInfo({
        autoRequestPermission: true,
      });
      setUserID(userInfo.id);
      setUserName(userInfo.name);
      setAvatar(userInfo.avatar);
      console.log(userInfo);
      const data = await getPhoneNumber();
      const token = data?.token;
      console.log("tokten " + token);
      if (token) {
        const requestOptions = {
          method: "POST",
          redirect: "follow" as RequestRedirect,
        };
        const url = `https://giabinhso.tayninh.gov.vn/api/UserInfoMiniApp/GetPhoneNumberByToken?accessToken=${accessToken}&token=${token}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("kq " + result);
        if (result.success) {
          setSdt(replace84(result.data.data.number));
          console.log(result.data.data.number);
        } else {
          console.error("Failed to get phone number:", result.message);
        }
      } else {
        console.error("Token is undefined");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

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

  const requestOptions = {
    method: "POST",
    redirect: "follow" as RequestRedirect,
  };

  const _getPhoneNumberByToken = async (accessToken, token) => {
    return fetch(
      `https://giabinhso.tayninh.gov.vn/api/UserInfoMiniApp/GetPhoneNumberByToken?accessToken=${accessToken}&token=${token}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        toastHandler.current?.close();
        if (result.data.error === 0) {
          return result.data.data.number;
        } else return "0";
      })
      .catch((error) => console.log("error", error));
  };

  const _registerAndGetUserInfo = () => {
    getAccessToken({
      success: (accessToken) => {
        // xử lý khi gọi api thành công
        // console.log(accessToken);
        getPhoneNumber({
          success: async (data) => {
            // xử lý khi gọi api thành công
            const { token, number } = data;
            // Xử lý bản zalo cũ hơn 23.0.2
            if (number) {
              const formatedNumber = replace84(number);
            }
            // Xử lý flow lấy sdt mới
            else if (token) {
              const number = await _getPhoneNumberByToken(accessToken, token);
              if (number != "0") {
                const formatedNumber = replace84(number);
              } else {
                toastHandler.current?.close();
              }
            }
          },
          fail: (error) => {
            // xử lý khi gọi api thất bại
            // người dùng từ chối cung cấp (-2002) thì hiển thị thông báo lỗi và thực hiện xin lại
            if (error.code === -2002) {
              Dialog.show({
                getContainer: document.getElementById("view-home"),
                content:
                  "Bạn đã từ chối cấp quyền truy cập số điện thoại. Trong trường hợp bạn cần bật lại quyền truy cập số điện thoại hãy làm theo hướng dẫn",
                closeOnAction: true,
                actions: [
                  {
                    key: "huongdan",
                    text: "Xem hướng dẫn",
                    onClick: () => {
                      openUrlInWebview(
                        "https://www.canva.com/design/DAFcw88XDC0/34z7Q6C7LZ6mYR8ZAjPm3w/view?utm_content=DAFcw88XDC0&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink"
                      );
                    },
                  },
                ],
              });
            }
            // zmp.toolbar.show("#app-tab-bar");
            toastHandler.current?.close();
          },
        });
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  };

  const _getCapThucHien = async () => {
    toastHandler.current = Toast.show({
      icon: "loading",
      content: "Đang tải",
      duration: 0,
      getContainer: document.getElementById("view-home"),
      maskClickable: false,
    });
    return fetch(
      `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/GetCapThucHien?LoaiHoSoID=${loaiHoSoID.loaiHoSoID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCapThucHien([data.data]);
        console.log([data.data[0].value]);
        toastHandler.current?.close();
      });
  };

  async function uploadFile(file: File, hoSoKemTheoID: string) {
    // Validate input
    if (!file) {
      throw new Error("No file provided for upload.");
    }
    if (!hoSoKemTheoID) {
      throw new Error("hoSoKemTheoID is required.");
    }

    // Prepare the FormData object
    const formdata = new FormData();
    formdata.append("HSKemTheoID", hoSoKemTheoID);
    formdata.append("File", file);

    // Configure the request options
    const requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow" as RequestRedirect, // Explicitly cast to RequestRedirect
    };

    try {
      // Make the request
      const response = await fetch(
        `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/UploadFile`,
        requestOptions
      );

      // Check for HTTP errors
      if (!response.ok) {
        const errorMessage = `Upload failed with status ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Parse the response as JSON
      const result = await response.json();

      // Check for API-specific errors
      if (!result.data || !result.data.lienKet || !result.thumbnailUrl) {
        throw new Error("Unexpected response structure from the API.");
      }

      // Return the result
      return {
        url:
          "https://dichvucong.tayninh.gov.vn/Account/DownLoad?url=" +
          result.data.lienKet,
        extra: result.data,
        thumbnailUrl:
          `https://smart-api.tayninh.gov.vn/UserFiles/FileUpload/` +
          result.thumbnailUrl,
      };
    } catch (error) {
      // Handle unknown type of error
      if (error instanceof Error) {
        console.error("File upload error:", error.message);
        throw new Error(`Failed to upload file: ${error.message}`);
      } else {
        console.error("An unexpected error occurred:", error);
        throw new Error("Failed to upload file due to an unknown error.");
      }
    }
  }

  const _getDonViThucHien = async (cap) => {
    toastHandler.current = Toast.show({
      icon: "loading",
      content: "Đang tải",
      duration: 0,
      getContainer: document.getElementById("view-home"),
      maskClickable: false,
    });
    setSelectedCapThucHien(cap);

    return fetch(
      `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/GetDonViThucHien?LoaiHoSoID=${loaiHoSoID.loaiHoSoID}&CapThucHien=${cap}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        },
        body: JSON.stringify({}),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDonViThucHien([data.data]);
        console.log([data.data]);
        toastHandler.current?.close();
      });
  };

  const _getDonViThucHienCon = async (huyenid) => {
    toastHandler.current = Toast.show({
      icon: "loading",
      content: "Đang tải",
      duration: 0,
      getContainer: document.getElementById("view-home"),
      maskClickable: false,
    });
    return fetch(
      `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/GetDonViThucHienXa?LoaiHoSoID=${loaiHoSoID.loaiHoSoID}&HuyenID=${huyenid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        },
        body: JSON.stringify({}),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDonViThucHienCon([data.data]);
        toastHandler.current?.close();
      });
  };

  const _getMucDo = async (donviid) => {
    toastHandler.current = Toast.show({
      icon: "loading",
      content: "Đang tải",
      duration: 0,
      getContainer: document.getElementById("view-home"),
      maskClickable: false,
    });
    setDonVi(donviid);
    return fetch(
      `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/GetMucDo?LoaiHoSoID=${loaiHoSoID.loaiHoSoID}&DonViID=${donviid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        },
        body: JSON.stringify({}),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setMucDo(data.data[0].mucDo);
        toastHandler.current?.close();
      });
  };

  const _getDsHoSoKemTheo = async () => {
    toastHandler.current = Toast.show({
      icon: "loading",
      content: "Đang tải",
      duration: 0,
      getContainer: document.getElementById("view-home"),
      maskClickable: false,
    });
    return fetch(
      `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/GetDanhSachHoSoKemTheo?LoaiHoSoID=${loaiHoSoID.loaiHoSoID}&DonViID=${donvi}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        },
        body: JSON.stringify({}),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDsHoSoKemTheo(data.data);
        toastHandler.current?.close();
      });
  };

  const _nextStep = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      _getDsHoSoKemTheo();
    } else if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      //TODO: submit
    }
  };

  const _nopHoSo = async (value) => {
    toastHandler.current = Toast.show({
      icon: "loading",
      content: "Đang tải",
      duration: 0,
      getContainer: document.getElementById("view-home"),
      maskClickable: false,
    });

    const arrayHoSoKemTheo: any = [];
    dsHoSoKemTheo.map((item) => {
      value[item.hoSoKemTheoID]?.map((item) =>
        arrayHoSoKemTheo.push({
          ...item.extra,
          dungLuong: item.extra.dungLuong.toString(),
          isSign: item.extra.isSign.toString(),
        })
      );
    });

    const arrayHoSoKemTheoMerge = arrayHoSoKemTheo.reduce((a, b) => {
      const found = a.find((e) => e.hoSoKemTheoId === b.hoSoKemTheoId);
      return (
        found
          ? ((found.lienKet = found.lienKet + "|" + b.lienKet),
            (found.tenTiepDinhKem =
              found.tenTiepDinhKem + "|" + b.tenTiepDinhKem),
            (found.dungLuong = found.dungLuong + "|" + b.dungLuong))
          : a.push({ ...b }),
        a
      );
    }, []);

    var raw = JSON.stringify({
      KhachHangID: "581442",
      LinhVucID: loaiHoSoID.linhVucID,
      LoaiHoSoID: loaiHoSoID.loaiHoSoID,
      DonViID: donvi,
      TinhTrang: "THS",
      HoTenNguoiNop: value.HoTenNguoiNop,
      GioiTinh: "0",
      QuocTichID: "2",
      LoaiGiayToID: "1",
      SoGiayToTuyThan: value.SoGiayToTuyThan,
      HoKhauThuongTru: "",
      DienThoaiNguoiNop: value.DienThoaiNguoiNop,
      EmailNguoiNop: "",
      SoNha: "",
      DiaChiDangKy: "",
      DKNop: 0,
      DKTra: 0,
      DKNhanThuPhi: 0,
      HoTenNop: "",
      DienThoaiNop: "",
      SoNhaNop: "",
      TinhThanhIDNop: "0",
      QuanIDNop: "0",
      PhuongIDNop: "0",
      DuongIDNop: "0",
      DiaChiNop: "",
      HoTenTra: "",
      SoNhaTra: "",
      TinhThanhIDTra: "0",
      QuanIDTra: "0",
      PhuongIDTra: "0",
      DuongIDTra: "0",
      DiaChiTra: "",
      DienThoaiTra: "",
      dsHoSoKemTheo: arrayHoSoKemTheoMerge,
      HinhThuc: 4,
    });

    try {
      const response = await fetch(
        `https://smart-api.tayninh.gov.vn/api/MotCuaDienTu/NopHoSo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer `, // Replace with actual token logic
          },
          body: raw,
        }
      );

      const data = await response.json();
      if (data.success) {
        Toast.show({ icon: "success", content: "Nộp hồ sơ thành công!" });
        setCurrentStep(2);
      } else {
        Toast.show({
          icon: "fail",
          content: data.message || "Nộp hồ sơ thất bại!",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Toast.show({
        icon: "fail",
        content: "Đã xảy ra lỗi. Vui lòng thử lại!",
      });
    } finally {
      toastHandler.current?.close();
    }
  };

  return (
    <Page>
      <Steps current={currentStep} style={{ backgroundColor: "white" }}>
        <Step title="Bước 1" description="Chọn đơn vị thực hiện" />
        <Step title="Bước 2" description="Chụp ảnh giấy tờ kèm theo" />
        <Step title="Bước 3" description="Hoàn tất & thanh toán" />
      </Steps>

      {currentStep === 0 && (
        <Form
          key={"Form1"}
          layout="vertical"
          onFinish={_nextStep}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              disabled={mucDo === null || mucDo < 3}
            >
              Tiếp theo
            </Button>
          }
        >
          <Form.Header>CHỌN CƠ QUAN THỰC HIỆN</Form.Header>

          <Form.Item
            name="capThucHien"
            label="Cấp thực hiện"
            rules={[{ required: true, message: "Bắt buộc" }]}
            trigger="onConfirm"
            onClick={() => setCapThucHienPicker(true)}
          >
            <Picker
              getContainer={null}
              key="capThucHien"
              columns={capThucHien}
              cancelText="Hủy"
              confirmText="Xác nhận"
              visible={capThucHienPicker}
              onClose={() => setCapThucHienPicker(false)}
              onConfirm={(value, extendedItems) => {
                console.log("Selected Value:", value);
                console.log("Selected Items (extended):", extendedItems);
                if (value && value[0]) {
                  _getDonViThucHien(value[0]);
                }
              }}
            >
              {(items) => (
                <span>
                  {items.every((item) => item === null)
                    ? "Vui lòng chọn"
                    : items.map((item) => item?.label || "").join(", ")}
                </span>
              )}
            </Picker>
          </Form.Item>

          <Form.Item
            name="donViThucHien"
            label="Đơn vị thực hiện"
            rules={[{ required: true, message: "Bắt buộc" }]}
            trigger="onConfirm"
            onClick={(e) => {
              setDonViThucHienPicker(true);
            }}
          >
            <Picker
              getContainer={null}
              key="donViThucHien"
              columns={donViThucHien}
              cancelText="Hủy"
              confirmText="Xác nhận"
              visible={donViThucHienPicker}
              onClose={() => {
                setDonViThucHienPicker(false);
              }}
              onConfirm={(value, column) => {
                selectedCapThucHien === 3
                  ? _getDonViThucHienCon(value[0])
                  : _getMucDo(value[0]);
              }}
            >
              {(items, { open }) => {
                return (
                  <>
                    {items.every((item) => item === null)
                      ? "Vui lòng chọn"
                      : items.map((item) => item?.label)}
                  </>
                );
              }}
            </Picker>
          </Form.Item>

          {selectedCapThucHien === 3 && (
            <Form.Item
              name="donViThucHienCon"
              label="Chọn xã/phường/thị trấn"
              rules={[{ required: true, message: "Bắt buộc" }]}
              trigger="onConfirm"
              onClick={(e) => {
                setDonViThucHienConPicker(true);
              }}
            >
              <Picker
                getContainer={null}
                key="donViThucHienCon"
                columns={donViThucHienCon}
                cancelText="Hủy"
                confirmText="Xác nhận"
                visible={donViThucHienConPicker}
                onClose={() => {
                  setDonViThucHienConPicker(false);
                }}
                onConfirm={(value, column) => {
                  _getMucDo(value[0]);
                }}
              >
                {(items, { open }) => {
                  return (
                    <>
                      {items.every((item) => item === null)
                        ? "Vui lòng chọn"
                        : items.map((item) => item?.label)}
                    </>
                  );
                }}
              </Picker>
            </Form.Item>
          )}

          {mucDo !== null && mucDo < 3 && (
            <NoticeBar
              content="Đơn vị đã chọn chưa hỗ trợ nộp trực tuyến"
              color="alert"
            />
          )}
        </Form>
      )}

      {currentStep == 1 && (
        <Form
          form={form}
          key={"form2"}
          // mode="card"
          onFinish={_nopHoSo}
          initialValues={{
            DienThoaiNguoiNop: sdt,
            HoTenNguoiNop: userName,
            SoGiayToTuyThan: "",
          }}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              disabled={
                dsHoSoKemTheo?.length > 0 && !dsHoSoKemTheo[0].hoSoKemTheoID
              }
            >
              Nộp hồ sơ
            </Button>
          }
        >
          <Form.Header>THÔNG TIN NGƯỜI NỘP HỒ SƠ</Form.Header>
          <Form.Item
            name="HoTenNguoiNop"
            label="Họ và tên"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input placeholder="Bắt buộc" />
          </Form.Item>
          <Form.Item
            name="SoGiayToTuyThan"
            label="Số CMND/CCCD"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input placeholder="Bắt buộc" />
          </Form.Item>
          <Form.Item
            name="DienThoaiNguoiNop"
            label="Số điện thoại"
            rules={[{ required: true, message: "Bắt buộc" }]}
          >
            <Input placeholder="Bắt buộc" />
          </Form.Item>

          <Form.Header>THÀNH PHẦN HỒ SƠ KÈM THEO</Form.Header>
          {dsHoSoKemTheo?.length > 0 &&
            dsHoSoKemTheo[0].hoSoKemTheoID &&
            dsHoSoKemTheo.map((item, index) => (
              <Form.Item
                name={item.hoSoKemTheoID}
                label={item.tenHoSoKemTheo}
                key={"hskemtheo" + index}
              >
                <ImageUploader
                  preview={true}
                  key={item.hoSoKemTheoID}
                  value={fileList}
                  onChange={setFileList}
                  upload={(file) => uploadFile(file, item.hoSoKemTheoID)}
                />
              </Form.Item>
            ))}
        </Form>
      )}

      {currentStep === 2 && (
        <Space direction="vertical" block style={{ padding: "6px" }}>
          <Result
            status="success"
            title="NỘP HỒ SƠ THÀNH CÔNG"
            description="Hồ sơ của Ông/Bà đã được gửi thành công. Hệ thống sẽ phản hồi thông tin và kết quả đến Ông/Bà thông qua ứng dụng Tây Ninh Smart , tin nhắn SMS và Cổng dịch vụ công tỉnh. Trong trường hợp thủ tục hành chính có phí, lệ phí, Ông/bà có thể thực hiện thanh toán trực tuyến trên ứng dụng Tây Ninh Smart tại mục 'Thanh toán trực tuyến'."
          />
          <Button block color="primary" onClick={() => navigate("/qrinfo/")}>
            Đến kho dữ liệu cá nhân
          </Button>
          <Button block color="default" onClick={() => navigate("/")}>
            {" "}
            Về trang chủ
          </Button>
        </Space>
      )}

      <Dialog
        visible={visible}
        header={
          <PhoneFill
            style={{
              fontSize: 42,
              color: "var(--adm-color-warning)",
            }}
          />
        }
        title="Vui lòng cấp quyền ứng dụng sử dụng số điện thoại để sử dụng chức năng này"
        content="Số điện thoại được dùng để nhận thông báo tình trạng hồ sơ, định danh kết quả điện tử và tài liệu cá nhân. Thông tin này sẽ được bảo mật và không hiển thị với cán bộ xử lý phản ánh."
        getContainer={document.getElementById("view-home")}
        destroyOnClose={true}
        closeOnAction
        // onClose={() => {

        // }}
        actions={[
          [
            {
              key: "cancel",
              text: "Trở lại",
              danger: true,
              onClick: () => {
                setVisible(false), navigate(-1);
              },
            },
            {
              key: "confirm",
              text: "Cấp quyền",
              onClick: () => {
                //_registerAndGetUserInfo(store.state.user);
                setVisible(false);
              },
            },
          ],
        ]}
      />
    </Page>
  );
};

export const HoanTatPage: FC = () => {
  return (
    <Page hideScrollbar={true}>
      <Header
        backIcon={<Icon icon="zi-arrow-left" style={{ color: "#fff" }} />}
        style={{
          background: mainColor,
          color: "#fff",
        }}
        title="Nộp Hồ Sơ"
      />
      <Suspense>
        <HoanTatPageContent />
      </Suspense>
    </Page>
  );
};
