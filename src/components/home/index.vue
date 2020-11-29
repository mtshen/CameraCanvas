<template>
  <div class="buleDraftBeerCupBtns">
    <div class="recommendVoice">
      <i class="iconfont iconyuyinshuru"></i>
      <p class="title">请说出你要使用的操作</p>
    </div>
    <div class="btns">
      <GButton text="注册系统" class="btn" />
      <GButton text="登陆拣选" class="btn" @click="login"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GButton from "@/components/ui/button.vue";

@Options({
  data() {
    return {
    };
  },
  created() {

  },
  mounted() {
  },
  methods: {
    login() {
      this.$emit("changestep", 3);
    }
  },
  components: {
    GButton,
  },
})
export default class HelloWorld extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.buleDraftBeerCupBtns {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 20px;

  .btns {
    display: inline-block;
    padding: 0 20px;
    border: 1px solid #03A9F4;
    box-shadow: 0 0 0px #03A9F4 inset;
    transition: 1s all;
  }

  .btn {
    display: block;
    margin: 30px auto;

  }

  .recommendVoice {
    display: inline-block;
    padding: 0 20px;
    border: 1px solid #03A9F4;
    box-shadow: 0 0 0px #03A9F4 inset;
    transition: 1s all;
    width: 340px;
    height: 210px;
    .title {
      font: 30px "Helvetiva";
      margin: 0;
      padding: 0;
      margin-top: 20px;
      color: #008bd5;
    }

    margin-right: 40px;
  }

  .iconyuyinshuru {
    font-size: 70px;
    display: block;
    margin-top: 20px;
    text-align: center;
    color: #03A9F4;
    text-shadow: 0 0 0px #03A9F4;
    transition: 1s all;
  }
}
</style>
<style lang="scss">
.activation {
  .buleDraftBeerCupBtns {
    .iconyuyinshuru {
      text-shadow: 0 0 3px #03A9F4;
    }

    .recommendVoice {
      box-shadow: 0 0 8px #03A9F4 inset;
    }

    .btns {
      box-shadow: 0 0 8px #03A9F4 inset;
    }
  }
}
</style>
