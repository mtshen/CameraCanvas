import axios from "axios";

export function play(text) {
  const formdata = new FormData();// 创建form对象
  formdata.append('text', text);
  return axios.post("http://localhost:30000/play", formdata, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}
