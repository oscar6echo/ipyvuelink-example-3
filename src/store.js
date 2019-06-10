import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    style: {},
    countries: [],
    selected: null
  },
  getters: {
    style: state => state.style,
    countries: state => state.countries,
    selected: state => state.selected
  },
  mutations: {
    setStyle: (state, data) => {
      Vue.set(state, 'style', data);
    },
    setCountries: (state, data) => {
      Vue.set(state, 'countries', data);
    },
    setSelected: (state, data) => {
      Vue.set(state, 'selected', data);
    }
  },
  actions: {
    setStyle: async (context, data) => {
      context.commit('setStyle', data);
    },
    setCountries: async (context, data) => {
      context.commit('setCountries', data);
    },
    setSelected: async (context, data) => {
      context.commit('setSelected', data);
    }
  }
});
