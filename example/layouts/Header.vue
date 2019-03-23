<template>
  <header class="app__header">
    <nav class="navbar fixed-top">
      <h1 class="navbar-brand mr-auto">
        <img src="https://raw.githubusercontent.com/David-Desmaisons/ComponentFixture/master/logo.png" alt="Project Logo" />
        Component Fixture
      </h1>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#">Github</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="less" scoped>
.app__header {
  .navbar {
    background: #fff;
    border-bottom: 1px solid #eaeaea;
  }
  .navbar-brand {
    margin-bottom: 0;

    img {
      max-width: 40px;
    }
  }
}
</style>

