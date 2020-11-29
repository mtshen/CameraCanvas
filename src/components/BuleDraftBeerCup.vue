<template>
  <div>
    <div class="canvasLists">
      <canvas ref="canvasBg" class="canvasBg"></canvas>
      <canvas ref="canvas" class="canvasMain"></canvas>
    </div>
    <vue-loaders-line-scale-pulse-out-rapid class="loaderLine" v-if="faceGetFaceLoading" />
  </div>
</template>

<script lang="js">
import { Options, Vue } from 'vue-class-component';
import { Distinguish } from "./Distinguish";
import { play, faceGetFaceId } from "@/components/api/common"

@Options({
  data() {
    return {
      canvasBg: null,
      canvasBGW: 0,
      canvasBGH: 0,
      distinguish: null,
      width: 642 * 1.2,
      height: 482 * 1.2,
      faceGetFaceTimer: 20000,
      isStopRequestFaceGetFaceId: false,
      faceGetFaceLoading: false,

      // 工作站要维护的状态
      // 1. 当前工作站状态  status 0：未登录, 1：已登录, 2：锁定
      // 2. 登陆用户名       name 用户名
      // 3. 登陆黑名单    blacklist (当用户退出时, 会短暂的进入黑名单, 检测到该用户将不会触发任何操作)
      // 4. 当前登陆用户性别 gender 0 女士, 1 先生
      stationOpt: {
        name: "",
        status: 0,
        gender: 1,
        isDisabled: false,
        blacklist: [],
      },
      bgAnData: {
        x: 0,
        stop: false,
      },
    };
  },
  created() {

  },
  watch: {
    'stationOpt.status': {
      handler(value) {
        const { distinguish } = this;
        // 如果是登陆状态  置信度极低
        if (value === 1) {
          distinguish.setTinyFaceDetectorOptions({
            inputSize: 256,
            scoreThreshold: 0.1,
          });

          // 停止扫描
          this.stopDraw();
        } else {
          // 否则置信度较高
          distinguish.setTinyFaceDetectorOptions({
            inputSize: 256,
            scoreThreshold: 0.70,
          });

          // 开始扫描
          this.drawBg();
        }
      },
    }
  },
  mounted() {
    const { canvasBg, canvas } = this.$refs;
    this.canvasBGW = this.width;
    this.canvasBGH = this.height;
    canvasBg.width = this.canvasBGW;
    canvasBg.height = this.canvasBGH;
    canvas.width = this.width;
    canvas.height = this.height;
    this.canvasBg = canvasBg.getContext("2d");
    this.distinguish = new Distinguish(canvas, {
      videoWidth: this.width,
      videoHeight: this.height,
    });


    this.distinguish.initDistinguish();
    this.draw();
  },
  methods: {
    // 人物事件绑定
    initEvent() {
      this.distinguish.start();
      this.distinguish.startRender();

      // 人物进入事件
      this.distinguish.on("characterEntry", () => {
        document.body.classList.add("activation");
        // 进入之后轮询请求面部信息
        this.isStopRequestFaceGetFaceId = false;
        this.startRequestFaceGetFaceId();
      });

      // 人物离开事件
      this.distinguish.on("characterLeave", () => {
        document.body.classList.remove("activation");

        // 退出之后中断轮询请求
        this.stopRequestFaceGetFaceId();

        // 如果是登录状态则变更状态为锁定
        if (this.stationOpt.status === 1) {
          this.$emit("lock");
          this.stationOpt.status = 2;
        }
      });
    },


    // 绘制背景层
    drawBg() {
      const { canvasBg, canvasBGW, canvasBGH, bgAnData } = this;
      const bgAnDataX = bgAnData.x;

      // 清空画布
      canvasBg.clearRect(0, 0, canvasBGW, canvasBGH);

      canvasBg.beginPath();
      // 开始绘制
      canvasBg.moveTo(0, bgAnDataX);
      canvasBg.lineTo(canvasBGW, bgAnDataX);
      canvasBg.fillRect(0, 0, canvasBGW, bgAnDataX - 1);
      canvasBg.closePath();
      canvasBg.stroke();

      const nx = bgAnDataX + 3;

      // 是否停止
      if (this.bgAnData.stop) {
        bgAnData.x = 0;
        canvasBg.clearRect(0, 0, canvasBGW, canvasBGH);
      } else if (nx > canvasBGH) {
        bgAnData.x = 0;
        setTimeout(() => { canvasBg.clearRect(0, 0, canvasBGW, canvasBGH); }, 500);
        setTimeout(() => { this.drawBg(); }, 1000);
      } else {
        bgAnData.x = nx;
        requestAnimationFrame(() => {
          this.drawBg();
        });
      }
    },

    draw() {
      const { canvasBg } = this;
      canvasBg.strokeStyle = "#03a9f4";
      canvasBg.fillStyle = "#03a9f42b";
      canvasBg.lineWidth = 2;
      this.bgAnData.stop = false;
      this.drawBg();
    },

    stopDraw() {
      this.bgAnData.stop = true;
    },

    quit() {
      const { name, blacklist } = this.stationOpt;
      this.stationOpt.isDisabled = true;
      blacklist.push(name);
      setTimeout(() => {
        this.stationOpt.isDisabled = false;
        const nameIndex = blacklist.indexOf(name);
        nameIndex !== -1 && blacklist.splice(nameIndex, 1);
      }, 5000);
      this.stationOpt.name = "";
      this.stationOpt.status = 0;
      this.$emit('changestep', 2);
      play("谢谢您的使用! 再见!");
    },

    parseVideoToCanvas(video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const canvas2d = canvas.getContext('2d');
      canvas2d.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    },

    // 开始轮询请求 faceGetFaceId
    startRequestFaceGetFaceId() {
      if (!this.isStopRequestFaceGetFaceId) {

        // 数据有效且系统不在禁用状态
        if (!this.distinguish.isInvalidData && !this.stationOpt.isDisabled) {
          this.faceGetFaceId().then(({ data }) => {
            this.faceGetFaceLoading = false;
            this.handleFaceId(data);
              // 上一次请求结束  才开启下一次的请求
              setTimeout(() => {
                this.startRequestFaceGetFaceId();
              }, this.faceGetFaceTimer);
          });
        } else {
        // 无效数据则进入下一个轮询, 并且缩小轮询时间
          setTimeout(() => {
            this.startRequestFaceGetFaceId();
          }, 2000);
        }
      } else {
        this.faceGetFaceLoading = false;
      }
    },

    // 状态处理
    handleFaceId(faceName) {
      const { name, status, blacklist, gender } = this.stationOpt;
      // 如果在黑名单 直接退出状态变更处理
      if (blacklist.includes(faceName)) {
        return;
      }

      let playText;
      if (faceName) {
        const genderText = gender ? "先生" : "女士";

        switch (status) {
          // 锁定状态
          case 2:
            // 如果回来的是同一个人, 则进入登陆
            if (faceName === name) {
              // 纪录当前面部内容
              this.stationOpt.name = faceName;
              this.stationOpt.status = 1;
              // 提示欢迎回来
              playText = `${faceName}${genderText}，欢迎回来!`;
              play(playText);
              // 解锁
              this.$emit("unlock");
            } else {
              // 否则提示无法登陆
              playText = `该工作站正在被${name}使用!`;
              play(playText);
            }
            break;

          // 登陆状态
          case 1:
            // 如果发现人物更换即锁定
            if (faceName !== name) {
              this.stationOpt.status = 2;
              playText = `该工作站正在被${name}使用!`;
              play(playText);
              // 锁定
              this.$emit("lock");
            }
            break;
          // 未登录状态
          case 0:
            // 即登陆
            this.stationOpt.status = 1;
            this.stationOpt.name = faceName;
            playText = `您好，${faceName}${genderText}，欢迎您进入拣选工作站！`;
            play(playText);
            this.$emit('changestep', 3);
            break;
          default:
            break;
        }
      } else {
        // 如果是没有权限的用户进入
        switch (status) {
          case 1:
            // 正在运行的系统  即锁定
            this.stationOpt.status = 2;
            this.$emit("lock");
            playText = `该工作站正在被${name}使用!`;
            play(playText);
            break;
            // 未登录状态
          case 0:
            // 无权限身份
            // playText = `您好，您还没有注册,请先注册！`;
            // play(playText);
            break;
          default:
            break;
        }
      }
    },

    stopRequestFaceGetFaceId() {
      this.isStopRequestFaceGetFaceId = true;
    },

    faceGetFaceId() {
      const { distinguish } = this;
      this.faceGetFaceLoading = true;
      const imageData = this.parseVideoToCanvas(distinguish.cameraCanvas.videoElement);
      return faceGetFaceId(imageData);
    },
  },
})
export default class HelloWorld extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.canvasLists {
  position: relative;
  width: 760px;
  height: 480px;
  margin: 0 auto;
  margin-top: 20px;
  overflow: hidden;
}
.canvasMain {
  position: absolute;
  top: -60px;
  left: -4px;
}

.canvasBg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #03A9F4;
  box-shadow: 0 0 8px #03A9F4 inset;
  opacity: 0.9;
  z-index: 2;
}

.loaderLine {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
