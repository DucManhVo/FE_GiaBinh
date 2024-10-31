//Ghi đè thêm +84 khi lấy sđt Việt Nam
export const replace84 = (str: string) => {
  return str.replace(/^84/, "0");
};

//Function convert timestamp from API
export const formatTimeStamp = (timestampString) => {
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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getdata = async (method, url) => {
  return fetch(`${url}`, {
    method: method,
    redirect: "follow",
  });
};

export const replaceFile = (str: string) => {
  return str.replace(/^~/, "");
};

export const postLichSu = async (
  method,
  url,
  dienThoai,
  pageRows,
  pageIndex
) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("dienThoai", dienThoai);
  urlencoded.append("pageRows", pageRows);
  urlencoded.append("pageIndex", pageIndex);
  return fetch(`${url}`, {
    method: method,
    body: urlencoded,
    headers: myHeaders,
    redirect: "follow",
  });
};
