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

  constructor(canvas, intervalTime) {
    intervalTime && (this.intervalTime = intervalTime);
    // 创建摄像头控制实例
    this.cameraCanvas = new CameraCanvas({ canvas });
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
    return new Promise((resolve, reject) => {
      this.cameraCanvas.getAuth()
        .then(() => {
          this.startTimer();
          resolve();
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
      if (this.intervalTimer) {
        clearInterval(this.intervalTimer);
        this.intervalTimer = null;
      }

      if (results && !this.distinguishResult) {
        this.onCharacterEntry(results);
      } else if (!results && this.distinguishResult) {
        this.onCharacterLeave();
      }

      this.distinguishResult = results;

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

  on(eventName, callback) {
    this._event[eventName] = callback;
  }
}
