<template>
  <div>
    <hot-table
      :id="root"
      :settings="hotSettings"
      ref="myTable"
      v-if="hotSettings.data"
      :key="componentKey"
      class="hot"
      @drag="componentKey += 1"
    ></hot-table>
  </div>
</template>

<script>
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/vue";
import "handsontable/dist/handsontable.full.css";
import { store } from "../store";

export default {
  data() {
    return {
      store,
      root: "testHot",
      componentKey: 0,
      hotSettings: {
        data: null,
        colHeaders: ["Author", "Message", "Pic", "Created On"],
        columns: this.getColumns(),
        stretchH: "all",
        licenseKey: "non-commercial-and-evaluation",
      },
    };
  },
  components: {
    HotTable,
  },
  watch: {
    "store.ballsInFeed": {
      handler() {
        let balls = [];
        this.store.ballsInFeed.forEach((ball) => {
          balls.push([
            ball.author_name,
            ball.message,
            ball.author_image,
            ball.createdOn.toDate(),
          ]);
        });
        this.hotSettings.data = balls;
        if (this.$refs.myTable) {
          this.componentKey += 1;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      let balls = [];
      if (this.store && this.store.ballsInFeed) {
        this.store.ballsInFeed.forEach((ball) => {
          balls.push([
            ball.author_name,
            ball.message,
            ball.author_image,
            ball.createdOn.toDate(),
          ]);
        });
        this.hotSettings.data = balls;
        if (this.$refs.myTable) {
          this.componentKey += 1;
        }
      }
      window.addEventListener("resize", () => {
        this.componentKey += 1;
      });
    });
  },
  methods: {
    getColumns() {
      return [
        {
          readOnly: true,
        },
        {
          readOnly: true,
        },
        {
          renderer: function(instance, td, row, col, prop, value) {
            const escaped = Handsontable.helper.stringify(value);
            let img = null;

            if (escaped.indexOf("http") === 0) {
              img = document.createElement("IMG");
              img.referrerPolicy = "no-referrer";
              img.style = "width: 100%;";
              img.src = value;

              Handsontable.dom.addEvent(img, "mousedown", function(event) {
                event.preventDefault();
              });

              Handsontable.dom.empty(td);
              td.appendChild(img);
            } else {
              Handsontable.renderers.TextRenderer.apply(this, arguments);
            }

            return td;
          },
        },
        {
          type: "date",
          dateFormat: "MM/DD/YYYY",
          editor: false,
        },
      ];
    },
  },
  beforeMount() {
    window.addEventListener("resize", () => {
      this.componentKey += 1;
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.componentKey += 1;
    });
  },
};
</script>
<style scoped>
#testHot {
  height: 100vh;
  overflow: hidden;
}
</style>
