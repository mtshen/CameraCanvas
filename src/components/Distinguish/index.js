// distinguish 用于对人像的识别, 基于 CameraCanvas 和 faceAPI 实现
// 目前需要实现调用开始后对人像间隔进行识别, 扫码到人像后应有回调函数可用
import { CameraCanvas } from "@/components/CameraCanvas";
import * as faceapi from 'face-api.js';

export class Distinguish {
  canvas;
  canvas2d;
  cameraCanvas;
  intervalTime = 5000;
  intervalTimer = null;
  distinguishResult;
  _event = {};
  isLoadOver = false;
  // 离开时间, 当失去图形超过1500ms才会被判断为失去图像
  entryTime = null;
  // 当前数据集是否是无效数据
  isInvalidData = true;

  constructor(canvas, option) {
    const { videoWidth, videoHeight, intervalTime } = option;
    intervalTime && (this.intervalTime = intervalTime);
    // 创建摄像头控制实例
    this.cameraCanvas = new CameraCanvas({
      canvas, width: videoWidth, height: videoHeight
    });
    // 载入算法
    this.loadWeights();

    this.canvas = canvas;
    this.canvas2d = canvas.getContext("2d");

    // 匹配canvas
    faceapi.matchDimensions(canvas, { width: canvas.width, height: canvas.height });
  }

  // 载入算法
  async loadWeights() {
    // 载入识别算法
    await faceapi.nets.ssdMobilenetv1.load('/weights');
    await faceapi.nets.ageGenderNet.loadFromUri('/weights');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');
  }

  // 开始识别人像
  async start() {
    // 开始之前先获取权限, 如果成功则开始间隔去检查人脸数据
    this.distinguish();
  }

  // 初始化获取权限
  initDistinguish() {
    // 开始之前先获取权限, 如果成功则开始间隔去检查人脸数据
    return new Promise((resolve, reject) => {
      this.cameraCanvas.getAuth()
        .then(() => {
          const { cameraCanvas } = this;
          const videoElement = cameraCanvas.videoElement;
          const videoFaceTimer = setInterval(() => {
            faceapi.detectSingleFace(videoElement).then(() => {
              // 进来之后就算作加载完成了, 不再进行轮询调用
              if (!this.isLoadOver) {
                clearInterval(videoFaceTimer);
                this.isLoadOver = true;
                this.onLoadOver();
                resolve();
              }
            });
          }, 5000);
        })
        .catch((error) => reject(error));
    });
  }

  startTimer() {
    this.distinguish();
    this.startRender();
    this.intervalTimer = setInterval(() => this.distinguish(), this.intervalTime);
  }

  distinguish() {
    const { cameraCanvas } = this;
    const videoElement = cameraCanvas.videoElement;
    faceapi.detectSingleFace(videoElement).withFaceLandmarks().then((results) => {
      if (results && !this.distinguishResult) {
        this.onCharacterEntry(results);
      } else if (!results && this.distinguishResult) {
        const { entryTime } = this;
        const thatEntryTime = +new Date;

        if (!entryTime) {
          this.entryTime = thatEntryTime;
          // 此时虽然没有检测到人脸, 但是没有判定为离开, 因此会出现3秒的无效数据, 这时候不应该去发送调用接口
          this.onInvalidData();
        } else if (thatEntryTime - entryTime > 3000) {
          this.distinguishResult = null;
          // 如果确认过离开了, 即增加100天对于离开的触发
          this.entryTime += 8640000000;
          this.onCharacterLeave();
        }
      }

      if (results) {
        this.entryTime = null;
        this.distinguishResult = results;
        this.isInvalidData = false;
      } else {
        this.isInvalidData = true;
      }

      window.requestAnimationFrame(() => {
        this.distinguish();
      });
    });
  }


  // 开始向Canvas渲染
  startRender() {
    const { canvas, canvas2d, cameraCanvas, distinguishResult } = this;
    const { videoElement } = cameraCanvas;

    if (videoElement.ended) {
        return;
    }
    // 将video上的图片的每一帧以图片的形式绘制的canvas上
    canvas2d.drawImage(videoElement, 0, 0);

    // 匹配区域
    distinguishResult && faceapi.draw.drawDetections(canvas, distinguishResult);
    distinguishResult && faceapi.draw.drawFaceLandmarks(canvas, distinguishResult);
    window.requestAnimationFrame(() => {
        this.startRender();
    });
  }

  // 停止识别人像
  end() {

  }

  // 获取面部信息后的回调函数

  // 人物进入的回调函数
  onCharacterEntry(data) {
    const { characterEntry } = this._event;
    characterEntry && characterEntry(data);
  }

  // 人物退出的回调函数
  onCharacterLeave() {
    const { characterLeave } = this._event;
    characterLeave && characterLeave();
  }

  // 当算法加载完成 可以计算出面部
  onLoadOver() {
    const { loadOver } = this._event;
    loadOver && loadOver();
  }

  // 当出现了无效数据
  onInvalidData() {
    const { invalidData } = this._event;
    invalidData && invalidData();
  }

  on(eventName, callback) {
    this._event[eventName] = callback;
  }
}
