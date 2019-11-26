<template>
  <b-container
    fluid
    id="my-controls"
    :style="styleContainer"
    class="debug-border"
  >
    <div class="d-flex flex-column">
      <div class="d-flex flex-row mt-2">
        <label id="nb-rows-label" class="ml-3 mt-2 p-0 pt-0" for="nb-rows"
          >Trip Time (sec):</label
        >
        <input
          id="trip-time"
          class="ml-2"
          type="number"
          step="0.1"
          v-model="tripTime"
        />
      </div>
      <b-form-select
        v-model="selectedCountry"
        :options="optionsCountry"
        id="my-select"
        class="mt-2 ml-3 mr-3"
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
      selectedCountry: null,
      optionsCountry: []
    };
  },
  computed: {
    style() {
      return this.$store.getters['style'];
    },
    countries() {
      return this.$store.getters['countries'];
    },
    styleContainer() {
      return {
        width: this.style.controls.width + 'px',
        height: this.style.controls.height + 'px'
      };
    },
    selected() {
      return this.$store.getters['selected'];
    }
  },
  watch: {
    countries: {
      handler: function() {
        this.optionsCountry = [
          { value: null, text: 'Select a Country', disabled: true },
          ...this.countries.map(e => ({ value: e, text: e }))
        ];
      },
      immediate: true
    },
    selectedCountry: function() {
      console.log(this.selectedCountry);
      this.$store.dispatch('setSelected', this.selectedCountry);
    },
    tripTime: function() {
      console.log(this.tripTime);
      this.$store.dispatch('setTripTime', this.tripTime);
    },
    selected(v) {
      this.selectedCountry = v;
    }
  },
  mounted() {}
};
</script>

<style scoped>
/* remove before build */
.debug-border {
  border: 1px solid red;
}

#my-controls {
  /* width: 300px;
  height: 400px; */
  display: flex;
  flex-direction: column;
}

#trip-time {
  max-width: 70px;
}
#my-select {
  width: 90%;
}
</style>
