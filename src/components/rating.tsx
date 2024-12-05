import React, { useState, useEffect, useCallback } from "react";
import { Grid, Toast } from "antd-mobile";
import { getdata, replace84 } from "../utils/short-function";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { getRouteParams } from "zmp-sdk";
import { getPhoneNumber, getAccessToken } from "zmp-sdk/apis";
import { getConfig } from "utils/config";

const RatingComponent = () => {
  const [selected, setSelected] = useState(0);
  const { id } = getRouteParams();
  const [chiTietTL, setChiTietTL] = useState<any[]>([]);
  const [chiTiet, setChiTiet] = useState<any[]>([]);
  const [rateValue, setRateValue] = useState(0);
  const [phoneUser, setPhoneUser] = useState("");
  const [phoneUserNow, setPhoneUserNow] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [count, setCount] = useState(0);
  const [rated, setRated] = useState(false);

  const mainColor = getConfig((c) => c.template.primaryColor);

  useEffect(() => {
    const fetchAcessToken = async () => {
      try {
        const accesstoken = await getAccessToken();
        setAccessToken(accesstoken);
        getPhone(accesstoken);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAcessToken();
  }, []);

  useEffect(() => {
    _getTL();
    _getData();
  }, [count]);

  const getPhone = useCallback(async (accessToken) => {
    try {
      const data = await getPhoneNumber();
      const token = data?.token;
      if (token) {
        const requestOptions = {
          method: "POST",
          redirect: "follow" as RequestRedirect,
        };
        const url = `https://giabinhso.tayninh.gov.vn/api/CongDan/GetPhoneNumberByToken?accessToken=${accessToken}&token=${token}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log(replace84(result.data.data.number));
        setPhoneUserNow(replace84(result.data.data.number));
      }
    } catch (error) {
      console.error("Error get data:", error);
    }
  }, []);

  const _getData = async () => {
    const response = await (
      await getdata(
        "GET",
        "https://hoidap.tayninh.gov.vn/HoiDapTrucTuyenServices.asmx/ChiTietCauHoi?id=" +
          id
      )
    )
      .json()
      .then((data) => {
        setChiTiet(data);
        console.log(data[0].DienThoai);
        setPhoneUser(data[0].DienThoai);
      });
  };

  const _getTL = async () => {
    const response = await (
      await getdata(
        "GET",
        "https://hoidap.tayninh.gov.vn/HoiDapTrucTuyenServices.asmx/ChiTietCauTraLoi?id=" +
          id
      )
    )
      .json()
      .then((data) => {
        setChiTietTL(data);
        setRateValue(data[0].RatingResult);

        if (data[0].RatingResult > 4) {
          setSelected(5);
        } else if (data[0].RatingResult >= 3) {
          setSelected(3);
        } else if (data[0].RatingResult >= 1) {
          setSelected(1);
        } else {
          setSelected(0);
        }
      });
  };

  const handleClick = async (index) => {
    const ratingValue = [1, 3, 5][index];
    setSelected(ratingValue);
    setCount(count + 1);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("idtr", chiTietTL[0].Id);
    urlencoded.append("rate", JSON.stringify(ratingValue));
    urlencoded.append("code", "i@lBavj3$79Rms84nd");

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    try {
      if (rateValue == null && phoneUser == phoneUserNow && rated == false) {
        // Make the POST request
        const response = await fetch(
          "https://hoidap.tayninh.gov.vn/HoiDapTrucTuyenServices.asmx/ratingtl",
          requestOptions
        );
        if (response.ok) {
          setRated(true);
          Toast.show({
            content: `Gửi đánh giá thành công`,
            position: "bottom",
          });
        } else {
          Toast.show({
            content: "Gửi đánh giá thất bại",
            position: "bottom",
          });
        }
      } else {
        Toast.show({
          content: "Bạn không thể đánh giá",
          position: "bottom",
        });
      }
    } catch (error) {
      Toast.show({
        content: "Lỗi trong quá trình xử lý",
        position: "bottom",
      });
    }
  };

  const icons = [
    <FrownOutlined value={1} style={{ margin: "10px" }} key="Không hài lòng" />,
    <MehOutlined value={3} style={{ margin: "10px" }} key="Chấp nhận" />,
    <SmileOutlined value={5} style={{ margin: "10px" }} key="Hài lòng" />,
  ];

  return (
    <Grid columns={3} gap={8}>
      {icons.map((icon, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          style={{
            fontSize: 36,
            color: selected === [1, 3, 5][index] ? mainColor : "#999",
            textAlign: "center",
          }}
        >
          {icon}
          <p
            style={{
              fontSize: 20,
            }}
          >
            {icons[index].key}
          </p>
        </div>
      ))}
    </Grid>
  );
};

export default RatingComponent;
