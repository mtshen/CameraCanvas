<template>
  <div class="loading" :style="{
    opacity: isHide ? 0 : 1
  }">
    <svg viewBox="0 0 100 100">
      <path
        d="M 50 50 m -40 0 a 40 40 0 1 0 80 0  a 40 40 0 1 0 -80 0"
        fill="none"
        stroke="#008caa"
        stroke-linecap="round"
        class="speedPath"
        :style="{ strokeDashoffset, opacity }"
        transform="rotate(90,50,50)"
        stroke-width="0.7">
      </path>
    </svg>
    <div class="geekLogoBox" :style="{
        opacity: overSpeed ? 1 : 0
      }">
      <div class="logoMerge">
        <svg class="fontIcon logo1" aria-hidden="true">
          <use xlink:href="#iconlogo2"></use>
        </svg>
        <svg class="fontIcon logo2" aria-hidden="true">
          <use xlink:href="#iconzapi-copy"></use>
        </svg>
      </div>
      <p class="teamTitle">蓝色扎啤杯</p>
    </div>
    <span class="speedText" :style="{
      opacity: overSpeed ? 0 : 1
    }"> {{ curSeppd || 0 }}% </span>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: ["speed"],
  data() {
    return {
      curSeppd: 0,
      overSpeed: false,
      distinguish: null,
      isHide: false,
    };
  },
  watch: {
    speed() {
      this.curSeppd = this.speed;
    },
    curSeppd(val) {
      if (Number(val) === 100) {
        this.overSpeed = true;
      }
    },
  },
  computed: {
    strokeDashoffset() {
      // 1% 是 2.52
      const { curSeppd = 0 } = this;
      return 252 - (Number(curSeppd) * 2.52);
    },
    // 透明 从 30% ~ 100%
    opacity() {
      const { curSeppd = 0 } = this;
      return (30 + (Number(curSeppd) * 3.6) / 100);
    },
  },
  created() {

  },
  mounted() {

  },
  methods: {
    setSpeed(speed: number, time: number) {
      return new Promise((resolve) => {
        const { curSeppd } = this;
        // 每 N time 自增 1% 进度
        const selfIncreas = (speed - Number(curSeppd)) / time;
        this.curSeppd = Number(this.curSeppd) + selfIncreas;
        const timer = setInterval(() => {
          const cSeppd = Number(this.curSeppd) + selfIncreas;
          if (cSeppd >= speed) {
            // eslint-disable-next-line no-debugger
            this.curSeppd = speed;
            clearInterval(timer);
            resolve();
          } else {
            this.curSeppd = cSeppd.toFixed(2);
          }
        }, selfIncreas);
      });
    },

    hide() {
      this.isHide = true;
    },
  },
})
export default class HelloWorld extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import url("./fault.scss");
.loading {
  top: 50%;
  left: 50%;
  width: 30vw;
  height: 30vw;
  position: fixed;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: 1s opacity;
  opacity: 1;

  .speedText {
    position: absolute;
    bottom: 3vw;
    left: 0vw;
    display: block;
    width: 5vw;
    text-align: left;
    border-bottom: 2px solid;
    text-indent: 5px;
    color: #007993;
    transition: 0.1s opacity;

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 3.5vw;
      border-bottom: 2px solid;
      transform: rotateZ(-41deg);
      transform-origin: left bottom;
      right: -3.5vw;
      bottom: -2px;
    }
  }
}

.speedPath {
  stroke-dasharray: 252px, 252px;
  transform: rotateZ(-52deg);
  transform-origin: 50% 50%;
  transition: 0.1s opacity;
  opacity: 0.3;
}

.geekLogoBox {
  top: 30%;
  left: 50%;
  position: absolute;
  transition: 1s opacity;
  transform: translateX(-50%);
  .logoMerge {
    width: 100%;
    right: -5px;
    position: relative;
  }

  .logo1 {
    width: 75%;
    height: 5vw;
  }

  .logo2 {
    width: 25%;
    height: 5vw;
  }

  .teamTitle {
    font: 2.5vw "Helvetiva";
    margin: 0;
    padding: 0;
    color: #008bd5;
    // text-shadow: 0px 0px 3px;
    margin-top: 15px;
  }
}

</style>
