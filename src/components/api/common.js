import axios from "axios";

// 播放文本
export function play(text) {
  const formdata = new FormData();// 创建form对象
  formdata.append('text', text);
  console.log("play: ", text);
  return axios.post("http://localhost:30000/play", formdata, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

// 获取客户机状态
// 0：表示未在登录/注册流程中，没有感知到人脸，就绪状态
// 1：已人脸感知，提示登录或注册操作，等待客户端反馈下一步命令
// 2：已识别注册操作，提示用户说出名称进行注册
// 3：已识别收到注册姓名，提示注册成功，返回首页
// 4：已识别登录操作，进入人脸身份比对流程
// 5：人脸身份认证成功，提示进入拣选/符合打包
// 6：已识别 进入系统xxx，前端进入响应页面，登录成功 ，返回faceId
// export function getClientStatus() {
//   return axios.get("http://172.16.28.122:8080/client/getClientStatus?cid=1");
// }
export function faceGetFaceId(imageData) {
  const formdata = new FormData();// 创建form对象
  formdata.append('faceImage', convertBase64UrlToBlob(imageData));
  return axios.post('/face/getFaceId',formdata, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}

// 将图片转换成Blob格式内容
function convertBase64UrlToBlob(urlData) {
  const bytes = window.atob(urlData.split(',')[1]);
  // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}
