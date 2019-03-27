<template>
  <div id="app">
    <Header />
    <Sidebar/>
    <Content/>
  </div>
</template>

<script>
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";
import Content from "./layouts/Content";

export default {
  name: "app",
  data() {
    return {
      tab: null
    }
  },
  components: {
    Sidebar,
    Header,
    Content
  }
};
</script>

<style lang="less">
html {
  height: 100%;
}

body {
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  padding-top: 67px;
  display: flex;
}
</style>
