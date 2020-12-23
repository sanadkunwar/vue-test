<template>
  <div>
    <div class="container-fluid">
      <div id="topbar" class="row">
        <div class="col-3">
          <a href="#"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="95.2"
              height="20.720000000000002"
              viewBox="0 0 680 148"
              class=""
              style="shape-rendering: geometricprecision;"
            >
              <g>
                <path
                  fill="white"
                  d="M78.9992,1.8675 L13.0402,29.1605 C9.3722,30.6785 9.4102,35.8885 13.1012,37.3515 L79.3362,63.6175 C85.1562,65.9255 91.6372,65.9255 97.4562,63.6175 L163.6922,37.3515 C167.3822,35.8885 167.4212,30.6785 163.7522,29.1605 L97.7942,1.8675 C91.7762,-0.6225 85.0162,-0.6225 78.9992,1.8675"
                ></path>
                <path
                  fill="white"
                  d="M94.2726,77.9608 L94.2726,143.5768 C94.2726,146.6978 97.4196,148.8348 100.3206,147.6848 L174.1266,119.0368 C175.8116,118.3688 176.9166,116.7408 176.9166,114.9288 L176.9166,49.3128 C176.9166,46.1918 173.7696,44.0548 170.8686,45.2048 L97.0626,73.8528 C95.3786,74.5208 94.2726,76.1488 94.2726,77.9608"
                ></path>
                <path
                  fill="white"
                  d="M77.0384,81.3464 L55.1344,91.9224 L52.9104,92.9974 L6.6724,115.1524 C3.7414,116.5664 0.0004,114.4304 0.0004,111.1744 L0.0004,49.5884 C0.0004,48.4104 0.6044,47.3934 1.4144,46.6274 C1.7524,46.2884 2.1354,46.0094 2.5334,45.7884 C3.6384,45.1254 5.2144,44.9484 6.5544,45.4784 L76.6704,73.2594 C80.2344,74.6734 80.5144,79.6674 77.0384,81.3464"
                ></path>
              </g></svg
          ></a>
        </div>
        <div class="col-6"></div>
        <div class="col-3"></div>
      </div>
    </div>
    <div id="applicationContainer" class="row-custom">
      <div class="col-left">
        <div class="card">
          <div class="card-header">
            <div class="text-white">
              <font-awesome-icon v-if="!displayRight" @click="displayRight = true" icon="plus" />
            </div>
          </div>
          <div class="card-body">
            <BallsFeed />
          </div>
        </div>
      </div>
      <div
        class="sidebar"
        @mousedown="startResize"
        @pointermove="doResize"
        @mouseup="stopResize"
      ></div>
      <div class="col-right" v-show="displayRight">
        <div class="card">
          <div class="card-header">
            <div class="text-white m-1 toolbar" style="display:inline;">
              <font-awesome-icon icon="expand" @click="fullscreen()"/>
              <font-awesome-icon icon="times" @click="displayRight = false" />
            </div>
          </div>
          <div class="card-body">
            <Login v-if="!store.currentUser" />
            <div v-else>
              <button @click="logout">Log out</button>
              <InputForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

import { store } from "../store";
import Login from "./Login.vue";
import InputForm from "./InputForm.vue";
import BallsFeed from "./BallsFeed";

export default {
  data() {
    return {
      store,
      displayRight: true
    };
  },
  computed: {
    isLogin() {
      return store.currentUser == null ? false : true;
    },
  },
  methods: {
    fullscreen() {
      var elem = document.getElementsByClassName("col-right")[0];

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .catch((err) => alert(err.message || err));
    },
    doResize(e) {
      if (this.dragging) {
        const leftBox = document.querySelector(".col-left");
        const rightBox = document.querySelector(".col-right");
        const fullWidth = Math.max(
          document.documentElement["clientWidth"],
          document.body["scrollWidth"],
          document.documentElement["scrollWidth"],
          document.body["offsetWidth"],
          document.documentElement["offsetWidth"]
        );

        const sidebar = document.querySelector(".sidebar");
        let original_x = sidebar.getBoundingClientRect().left;
        const diff = e.pageX - original_x;
        // console.log(sidebar.getBoundingClientRect());
        leftBox.style.width =
          sidebar.getBoundingClientRect().left + diff - 10 + "px";
        rightBox.style.width =
          fullWidth - sidebar.getBoundingClientRect().right - diff + 10 + "px";
        this.$emit("drag");
      }
    },
    startResize(e) {
      this.dragging = true;
      this.original_mouse_x = e.pageX;
    },
    stopResize() {
      if (this.dragging) this.dragging = false;
    },
  },
  beforeMount() {
    window.addEventListener("pointermove", (e) => {
      this.doResize(e);
    });
  },

  beforeDestroy() {
    window.removeEventListener("pointermove", (e) => {
      this.doResize(e);
    });
  },
  mounted() {},
  components: {
    Login,
    InputForm,
    BallsFeed,
  },
};
</script>

<style>

#topbar {
  padding-top: 10px;
}
.row-custom {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.col-left {
  width: calc(70% - 20px);
  -webkit-transition: width 100ms ease-in-out;
  -moz-transition: width 100ms ease-in-out;
  -o-transition: width 100ms ease-in-out;
  transition: width 100ms ease-in-out;
}
.col-right {
  width: 30%;
  -webkit-transition: width 100ms ease-in-out;
  -moz-transition: width 100ms ease-in-out;
  -o-transition: width 100ms ease-in-out;
  transition: width 100ms ease-in-out;
}
#applicationContainer .card {
  border: none;
  border-radius: 0;
}
#applicationContainer .card-header {
  background: #1283da;
  border: none;
  border-radius: 0;
  height: 25px;
  text-align: right;
  padding: 0 10px;
}
#applicationContainer .card-body {
  height: 100vh;
}
.sidebar {
  position: relative;
  width: 20px;
  cursor: col-resize;
  background: #1283da;
  margin-top: 25px;
}
.toolbar svg:not(:first-child) {
  margin-left: 10px;
}
</style>
