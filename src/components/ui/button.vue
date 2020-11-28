<template>
  <button class="Geek_Button">{{ text }}</button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: ["text"],
  data() {
    return {
    };
  },
  created() {

  },
  mounted() {
  },
  methods: {},
})
export default class HelloWorld extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.Geek_Button {
  width: 300px;
  height: 60px;
  font-size: 24px;
  background-color: rgba(0,0,0,0);
  color: #2196F3;
  border: 1px solid #03A9F4;
  box-shadow: 0 0 0px #03A9F4 inset;
  border-radius: 6px;
  transition: 1s all;
}
</style>

<style lang="scss">
.activation {
  .Geek_Button {
    box-shadow: 0 0 8px #03A9F4 inset;
  }
}
</style>
