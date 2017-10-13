<template>
  <div class="home">
    <h1>欢迎来到主页！</h1>
    <router-link to="picker">
      <h2>picker组件</h2>
    </router-link>
    <router-link to="spinner">
      <h2>spinner组件</h2>
    </router-link>
    <router-link to="sticky">
      <h2>sticky指令</h2>
    </router-link>

    <router-link to="stickyComponentDemo">
      <h2>sticky组件</h2>
    </router-link>
    <router-link to="loadMore">
      <h2>loadMore组件</h2>
    </router-link>

    <router-link to="selfScroll">
      <h2>self-scroll指令</h2>
    </router-link>

    <router-link to="scroll">
      <h2>scroll指令</h2>
    </router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .home{
    text-align: center;
  }
</style>
