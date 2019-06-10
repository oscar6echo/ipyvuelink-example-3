<template>
  <b-container fluid id="my-controls" class="debug-border">
    <div class="d-flex flex-column">
      <div class="d-flex flex-row">
        <label id="nb-rows-label" class="m-1 p-1 pt-1" for="nb-rows"
          >Trip Time (sec):</label
        >
        <input
          id="trip-time"
          class="m-2"
          type="number"
          step="0.1"
          v-model="tripTime"
        />
      </div>
      <b-form-select
        v-model="nextCountry"
        :options="optionsCountry"
        id="my-select"
        class="m-2"
      ></b-form-select>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'Control',
  props: {},
  data() {
    return {
      tripTime: 2.0,
      nextCountry: null,
      optionsCountry: [
        { value: null, text: 'Select a country' },
        { value: 'France', text: 'France' },
        { value: 'Spain', text: 'Spain' }
      ]
    };
  }
};
</script>

<style scoped>
/* remove before build */
.debug-border {
  border: 1px solid red;
}

#my-controls {
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

#trip-time {
  width: 60px;
}
#my-select {
  width: 280px;
}
</style>
