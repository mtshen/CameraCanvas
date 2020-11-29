import Interface from "./interface";
/**
 * 摄像头动填转存Canvas
 *
 * 需要传入
 * canvas: canvas 元素
 * width: canvas的宽度, 需要传入具体数值
 * height: canvas的高度, 需要传入具体数值
 */
export class CameraCanvas {
  videoElement?: HTMLVideoElement = document.createElement("video");
  canvasElement?: HTMLCanvasElement;
  canvasElement2d?: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  mediaConf?: Object;
  isAuth: boolean = false;

  constructor(option: Interface) {
    const { video, canvas, width, height, mediaConf } = option;

    // canvas 是必填数据
    if (!canvas) {
        console.error("没有得到可用的Canvas数据");
        return;
    }
    // 参数
    // canvas元素
    this.canvasElement = canvas;
    // 2d实例
    this.canvasElement2d = canvas.getContext("2d") as CanvasRenderingContext2D;
    // 宽度
    this.width = width || canvas.width;
    // 高度
    this.height = height || canvas.height;
    // 媒体设置
    mediaConf && (this.mediaConf = mediaConf);
    // voide
    video && (this.videoElement = video);

    // 获取权限就系 直接播放到video中
    (this.videoElement as HTMLVideoElement).width = width as number;
    (this.videoElement as HTMLVideoElement).height = height as number;
    (this.videoElement as HTMLVideoElement).muted = false;
    (this.videoElement as HTMLVideoElement).volume = 0;
    (this.videoElement as HTMLVideoElement).addEventListener("loadedmetadata", () => {
      (this.videoElement as HTMLVideoElement).play();
    });
  }

  // 获取权限
  getAuth() {
    const { mediaConf,width, height } = this;
    return new Promise((resolve, reject) => {
      // 打开摄像头
      navigator.mediaDevices.getUserMedia(
        mediaConf || {
          video: { width, height, facingMode: "user" }
        }
      )

      // 当开启摄像头后, 开始载入video开始播放
      .then((data) => {
          this.getAuthDoneCallBack(data);
          resolve(data);
      })

      .catch((error) => {
          this.getAuthErrorCallBack(error);
          reject(error);
      });
    });
  }

  // 获取权限获取成功的回调
  getAuthDoneCallBack(mediaStream: MediaStream) {
      this.isAuth = true;
      (this.videoElement as HTMLVideoElement).srcObject = mediaStream;
  }

  // 获取权限获取失败后的回调
  getAuthErrorCallBack(error: Error) {
      this.isAuth = false;
      (this.videoElement as HTMLVideoElement).srcObject = null;
  }
}
