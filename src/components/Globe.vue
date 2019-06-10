<template>
  <div id="my-canvas" class="debug-border">TOTO</div>
</template>

<script>
export default {
  name: 'Globe',
  props: {}
};
</script>

<style scoped>
/* remove before build */
.debug-border {
  border: 1px solid red;
}

#my-canvas {
  width: 600px;
  height: 100%;

  background-color: 'green';
}
</style>
