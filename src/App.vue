<template>
  <!-- 人脸识别在第2步 才会展示 -->
  <Loading ref="loading" v-show="step === 1" :class="`step${step}`" @changestep="changestep" />
  <BuleDraftBeerCup
    ref="buleDraftBeerCup"
    v-show="step !== 1"
    @lock="lock"
    @unlock="unlock"
    @changestep="changestep"
  />
  <Home v-if="step === 2" @changestep="changestep" />

  <!-- 进入工作站, 一个过渡动画? -->
  <Station v-if="step === 3" :lock="isLock" @quit="quit" />
</template>

<script lang="js">
// vue相关
import { Options, Vue } from 'vue-class-component';
// 交互系统
import Home from "./components/home/index.vue";
// loading
import Loading from "./components/ui/loading.vue";
// 识别系统
import BuleDraftBeerCup from './components/BuleDraftBeerCup.vue';
// 按钮
import GButton from "@/components/ui/button.vue";
// 工作台
import Station from "./components/home/station";


@Options({
  data() {
    return {
      isLock: false,
      speed: 0,
      step: 0,
    }
  },
  mounted() {
    this.initStart();
  },
  methods: {
    changestep(step) {
      this.step = step;
    },

    // 解锁工作站
    unlock() {
      this.isLock = false;
    },

    // 锁定工作站
    lock() {
      this.isLock = true;
    },

    // 退出
    quit() {
      this.isLock = false;
      this.$refs.buleDraftBeerCup.quit();
    },

    // 开始
    initStart() {
      /**
       * 1. 假 Loading 等待视频算法初始化完成
       * 2. 当视频算法初始化完成后切换到真实loading, 结束加载步骤
       */
      const { loading, buleDraftBeerCup } = this.$refs;

      // 进入loading
      this.step = 1;

      // 假loading 开始
      loading.setSpeed(100, 2000);

      // 视频算法加载完成
      buleDraftBeerCup.distinguish.on("loadOver", () => {
        loading.setSpeed(100, 1000).then(
          this.loadOver.bind(this)
        );
      });
    },

    // loading 过渡动画
    loadTransition() {
      return new Promise((resolve) => {
        setTimeout(() => {this.$refs.loading.hide()}, 1000);
        // 动效需要1s
        setTimeout(() => {
          this.step = 2;
          resolve();
        }, 2000);
      })
    },

    // loading 结束后对人物进入与退出进行绑定
    loadOver() {
      this.loadTransition().then(() => {
        this.$refs.buleDraftBeerCup.initEvent();
      });
    },
  },
  components: {
    Home,
    Station,
    Loading,
    GButton,
    BuleDraftBeerCup,
  },
})
export default class App extends Vue {}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #000000;
  overflow: hidden;
  transition: 1s all;
}

.fontIcon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.step2 {
  animation: step1LogoAnimation 4s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  opacity: 0;
}


@keyframes step1LogoAnimation {
  0% {
    top: 50%;
    width: 30vw;
    height: 30vw;
    transform: translate(-50%, -50%);
  }

  100% {
    top: 0%;
    width: 10vw;
    height: 10vw;
    transform: translate(-50%,  0%);
  }
}

.gBtn {
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}
</style>
<style lang="scss">
.activation {
  #app {
    background-color: #073961;
  }
}
</style>
