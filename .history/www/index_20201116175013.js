const canvasElement = document.querySelector("canvas");

/**
 * 摄像头动填转存Canvas
 *
 * 需要传入
 * canvas: canvas 元素
 * width: canvas的宽度, 需要传入具体数值
 * height: canvas的高度, 需要传入具体数值
 */
class CameraCanvas {
    constructor(option) {
        const { canvas, width = 600, height = 800 } = option;

        // canvas 是必填数据
        if (!canvas) {
            console.error("没有得到可用的Canvas数据");
            return;
        }

        const videoElement = document.createElement("video");

        // 参数
        // 视频元素
        this.videoElement = videoElement;
        // canvas元素
        this.canvasElement = canvas;
        // 2d实例
        this.canvasElement2d = canvas.getContext("2d");
        // 宽度
        this.width = width;
        // 高度
        this.height = height;
        // 是否已经得到了权限
        this.isAuth = false;

        // 获取权限就系 直接播放到video中
        videoElement.width = width;
        videoElement.height = height;
        videoElement.addEventListener("loadedmetadata", () => {
            videoElement.play();
        });
    }

    // 获取权限
    getAuth(callBack) {
        const { width, height } = this;
        // 打开摄像头
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width, height }
        })

        // 当开启摄像头后, 开始载入video开始播放
        .then((data) => {
            this.getAuthDoneCallBack(data);
            callBack && callBack();
        })

        .catch((error) => {
            this.getAuthErrorCallBack(error);
            callBack && callBack();
        });
    }

    // 获取权限获取成功的回调
    getAuthDoneCallBack(mediaStream) {
        this.isAuth = true;
        this.videoElement.srcObject = mediaStream;
    }

    // 获取权限获取失败后的回调
    getAuthErrorCallBack() {
        this.isAuth = false;
        this.videoElement.srcObject = null;
    }

    // 开始向Canvas渲染
    startRender() {
        const { videoElement, canvasElement2d, width, height } = this;
        if (videoElement.ended) {
            return;
        }
        // 将video上的图片的每一帧以图片的形式绘制的canvas上
        canvasElement2d.drawImage(videoElement, 0, 0, width, height);
        window.requestAnimationFrame(this.startRender);
    }

}

debugger;
const cameraCanvas = new CameraCanvas({
    canvas: canvasElement,
    width: canvasElement.offsetWidth,
    height: canvasElement.offsetHeight,
});

cameraCanvas.getAuth(() => {
    cameraCanvas.startRender();
});
