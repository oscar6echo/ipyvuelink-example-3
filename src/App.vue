<template>
  <div>
    <b-container fluid id="app" class="ma-0 debug-border" :style="style.app">
      <Globe />
      <Controls />
    </b-container>

    <!-- remove debug b-card before build -->

    <b-card
      title="Debug Area"
      sub-title="Remove before build"
      class="m-2 debug-border"
      style="width:600px"
    >
      <b-card-text>
        size:
        {{ size }}
        <br />
        exposed:
        {{ exposed }}
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import store from './store';
import Globe from './components/Globe.vue';
import Controls from './components/Controls.vue';

export default {
  name: 'App',
  components: {
    Globe,
    Controls
  },
  beforeCreate() {
    this.$store = store();
  },
  props: {
    countryName: String
  },
  data() {
    return {
      //   config
      size: { height: 550, ratio: 1.6 }
      // technical
      // dataModel: null,
      // dataAvailable: false
    };
  },
  computed: {
    style() {
      return {
        globe: {
          width: this.size.height,
          height: this.size.height
        },
        controls: {
          width: Math.round(this.size.height * this.size.ratio - 1),
          height: this.size.height
        },
        app: {
          width: Math.round(this.size.height * this.size.ratio) + 'px',
          height: this.size.height + 'px'
        }
      };
    },
    exposed() {
      return this.$store.getters['exposed'];
    },
    selected() {
      return this.$store.getters['selected'];
    },
    centerCoords() {
      return this.$store.getters['centerCoords'];
    }
  },
  created() {
    this.$store.dispatch('setStyle', this.style);
  },
  watch: {
    exposed: {
      handler: function() {
        console.log(this.exposed);
        // this.dataModel.set('exposed', this.exposed);
        // this.dataModel.save_changes();
        // this.dataModel.touch();
      },
      immediate: true,
      deep: true
    },
    countryName: {
      handler: function(v) {
        this.$store.dispatch('setSelected', v);
      }
    },
    selected: {
      handler: function(v) {
        this.$emit('country-name', v);
      }
    },
    centerCoords: {
      handler: function(v) {
        this.$emit('center-coords', v);
      }
    }
  }
};
</script>

<style scoped>
/* remove before build */
.debug-border {
  border: 1px solid red;
}

/* override vuetify defaults in the context of standalone ipywidgets */
/* scoped css */
.container-fluid {
  margin: 0px;
  padding: 0px;
}

#app {
  /* width: 900px;
  height: 400px; */
  display: flex;
  flex-direction: row;
}
</style>
