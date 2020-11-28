<template>
  <div class="canvasLists">
    <canvas ref="canvasBg" class="canvasBg"></canvas>
    <canvas ref="canvas" class="canvasMain"></canvas>
  </div>
</template>

<script lang="js">
import { Options, Vue } from 'vue-class-component';
import { Distinguish } from "./Distinguish";
import axios from "axios";
import { play } from "@/components/api/common"

@Options({
  data() {
    return {
      canvasBg: null,
      canvasBGW: 0,
      canvasBGH: 0,
      distinguish: null,
    };
  },
  created() {

  },
  mounted() {
    const { canvasBg, canvas } = this.$refs;
    this.canvasBGW = canvasBg.offsetWidth;
    this.canvasBGH = canvasBg.offsetHeight;
    canvasBg.width = this.canvasBGW;
    canvasBg.height = this.canvasBGH;
    canvas.width = 642 * 1.2;
    canvas.height = 482 * 1.2;
    this.canvasBg = canvasBg.getContext("2d");
    this.distinguish = new Distinguish(canvas);
    this.distinguish.on("characterEntry", () => {
      document.body.classList.add("activation");
      this.faceGetFaceId();
      play("你好 请问您需要什么操作?");
    });
    this.distinguish.on("characterLeave", () => {
      document.body.classList.remove("activation");
      this.faceGetFaceId();
    });
    this.distinguish.start();
    this.draw();
  },
  methods: {
    drawBg() {
      const { canvasBg, canvasBGW, canvasBGH } = this;
      canvasBg.beginPath();
      canvasBg.strokeStyle = "#1e6674";
      canvasBg.lineWidth = 1;

      const gridWNumber = 9;
      const gridHNumber = 9;
      const gridWSpacing = canvasBGW / (gridWNumber + 1);
      const gridhSpacing = canvasBGW / (gridHNumber + 1);
      Array.prototype.forEach.call([...new Array(gridWNumber)], (val, index) => {
        const x = (index + 1) * gridWSpacing;
        canvasBg.moveTo(x, 0);
        canvasBg.lineTo(x, canvasBGH);
        canvasBg.stroke();
      });

      Array.prototype.forEach.call([...new Array(gridHNumber)], (val, index) => {
        const y = (index + 1) * gridhSpacing;
        canvasBg.moveTo(0, y);
        canvasBg.lineTo(canvasBGW, y);
        canvasBg.stroke();
      });

      canvasBg.closePath();
    },

    draw() {
      this.drawBg();
    },

    parseVideoToCanvas(video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const canvas2d = canvas.getContext('2d');
      canvas2d.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    },

    faceGetFaceId() {
      const { distinguish } = this;
      const formdata = new FormData();// 创建form对象
      formdata.append('faceInfo', this.parseVideoToCanvas(distinguish.cameraCanvas.videoElement));
      axios.post('http://172.16.28.122:8080/face/getFaceId',formdata, {
        headers: { "Content-Type": "multipart/form-data" }
      }).then(response => {   //这里的/xapi/upimage为接口
        console.log(response.data);
      });
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
  background: #0e3056;
  width: 100%;
  height: 100%;
  border: 1px solid #03A9F4;
  box-shadow: 0 0 8px #03A9F4 inset;
  opacity: 0.4;
  z-index: 2;
}
</style>
