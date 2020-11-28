<template>
  <!-- 人脸识别在第2步 才会展示 -->
  <Loading ref="loading" v-show="step === 1" :class="`step${step}`" />
  <GButton class="gBtn" text="start" v-show="step === 0" @click="initStart" />
  <BuleDraftBeerCup v-if="step === 2" />
  <Home v-if="step === 2" />
</template>

<script lang="js">
// vue相关
import { Options, Vue } from 'vue-class-component';
// 微软服务
// 交互系统
import Home from "./components/home/index.vue";
// loading
import Loading from "./components/ui/loading.vue";
// 识别系统
import BuleDraftBeerCup from './components/BuleDraftBeerCup.vue';
// 按钮
import GButton from "@/components/ui/button.vue";

@Options({
  data() {
    return {
      speed: 0,
      step: 0,
    }
  },
  mounted() {},
  methods: {
    // 开始
    initStart() {
      this.step = 1;
      this.$refs.loading.setSpeed(100, 400).then(() => {
        setTimeout(() => {
          this.$refs.loading.hide()
        }, 1000);
        // 动效需要1s
        setTimeout(() => { this.step = 2; }, 2000);
      });
    },
  },
  components: {
    Home,
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
