<template>
  <header class="app__header">
    <div class="start-items">
      <h1 class="app__name">
        <img
          src="../assets/logo.png"
          alt
        >
        Component Fixture
      </h1>

      <div class="app__components-select">
        <multiselect
          v-model="value"
          :options="options"
          :show-labels="false"
          :maxHeight="700"
          label="path"
          track-by="path"
          placeholder="Search and select a component"
          @select="changeComponent"
          close-on-select
          searchable
          hideSelected
        >
          <template
            slot="singleLabel"
            slot-scope="props"
          >
            <span class="option__placeholder">Current Component:</span>
            <div class="option__desc">
              <strong class="option__title">{{ props.option.meta.display }}</strong>
            </div>
          </template>
          <template
            slot="option"
            slot-scope="props"
          >
            <div class="option__desc">
              <strong class="option__title">{{ props.option.meta.display }}</strong>
            </div>
          </template>
        </multiselect>
      </div>
    </div>
    <div class="end-items">
      <a
        class="github-link"
        href="https://github.com/David-Desmaisons/ComponentFixture"
        target="_blank"
      >
        <i class="fa fa-github"></i>
      </a>
    </div>
  </header>
</template>

<script>
import Multiselect from "vue-multiselect";

function compare(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      value: ""
    };
  },
  created() {
    this.setInitComponentByRoute();
  },
  methods: {
    setInitComponentByRoute() {
      const {
        path,
        meta: { display }
      } = this.$route;

      this.value = {
        component: {},
        meta: {
          display
        },
        path
      };
    },
    changeComponent(routerEvent) {
      this.$router.push({ path: routerEvent.path });
    }
  },
  computed: {
    options() {
      return this.$router.options.routes
        .filter(r => r.meta)
        .sort((a, b) => compare(a.meta.display,b.meta.display));
    }
  }
};
</script>


<style lang="less" scoped>
.app__header {
  background: #fff;
  border-bottom: 1px solid #eaeaea;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;

  h1 {
    padding: 12px 16px;
    margin: 0;
    font-size: 16px;
    border-right: 1px solid #ddd;

    img {
      max-width: 22px;
    }
  }

  .github-link {
    color: black;
    font-size: 22px;
    padding: 0;
  }

  > div {
    display: flex;
    align-items: center;
  }

  .end-items {
    padding-right: 16px;
  }
}

.app__components-select {
  cursor: pointer;

  /deep/ .multiselect__tags {
    height: 100%;
    min-height: 46px;
    min-width: 260px;
    border-radius: 0;
    border: 0;
    border-right: 1px solid #e8e8e8;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 12px;
    display: flex;
    align-items: center;
  }
  /deep/ .multiselect__tags:hover {
    background: #fdfdfd;
  }

  /deep/ .multiselect__placeholder,
  /deep/ .multiselect__single {
    margin: 0;
    padding: 0;
  }
  /deep/ .multiselect__select,
  /deep/ .multiselect__select:before,
  /deep/ input {
    padding: 0;
    margin: 0;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /deep/ .multiselect__single {
    padding-left: 12px;
    padding-top: 8px;
    background: transparent;
  }

  .option__title {
    text-transform: capitalize;
  }
  .option__placeholder {
    text-transform: uppercase;
    color: #35495e96;
    font-size: 9px;
    font-weight: bold;
    position: absolute;
    top: -8px;
  }

  .multiselect--active {
    /deep/ .multiselect__tags {
      border-bottom: 1px solid #e8e8e8;
    }

    /deep/ input {
      position: absolute;
      top: 50%;
      background: #eee;
      border: 1px solid #ddd;
      width: calc(100% - 24px) !important;
      border-radius: 2px;
      padding: 6px 8px;

      &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #999;
        opacity: 1; /* Firefox */
        font-size: 14px;
      }

      &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #999;
        font-size: 14px;
      }

      &::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #999;
        font-size: 14px;
      }
    }
  }
}
</style>

