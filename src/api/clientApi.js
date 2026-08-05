import axios from "axios";

// 郵便番号から住所を取得する関数
const fetchAddressByPostalCode = async (postalCode) => {
  try {
    const response = await axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`);
    if (response.data.results && response.data.results[0]) {
      const r = response.data.results[0];
      return `${r.address1}${r.address2}${r.address3}`;
    }
    return "";
  } catch (error) {
    console.error("住所の取得に失敗しました", error);
    return "";
  }
};