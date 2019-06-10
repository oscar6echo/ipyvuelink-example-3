<template>
  <b-container fluid id="app" :style="style.app" class="ma-0 debug-border">
    <Globe />
    <Controls />
  </b-container>
</template>

<script>
import Globe from './components/Globe.vue';
import Controls from './components/Controls.vue';

export default {
  name: 'app',
  components: {
    Globe,
    Controls
  },
  data() {
    return {
      //   config
      size: { height: 550, ratio: 1.6 },
      country: 'France',

      // local

      // exposed
      exposed: {}
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
    }
  },
  created() {
    this.$store.dispatch('setStyle', this.style);
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
