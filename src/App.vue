<template>
  <b-container fluid id="app" class="ma-0 debug-border">
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
  width: 900px;
  height: 400px;
  display: flex;
  flex-direction: row;
}
</style>
