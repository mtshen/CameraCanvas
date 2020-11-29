<template>
  <div>
    <div class="stationBg">
      工作台状态: {{ lock ? "锁定": "活动"}}
    </div>
    <GButton @click="quit" text="退出" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GButton from "../ui/button.vue";

@Options({
  props: {
    lock: Boolean,
  },
  data() {
    return {
    };
  },
  created() {

  },
  mounted() {
  },
  methods: {
    quit() {
      if (!this.lock) {
        this.$emit("quit")
      }
    }
  },
  components: {
    GButton
  },
})
export default class HelloWorld extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.stationBg {
  color: #FFF;
  font-size: 60px;
  padding: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px solid #03A9F4;
  box-shadow: 0 0 8px #03A9F4 inset;
}
</style>
