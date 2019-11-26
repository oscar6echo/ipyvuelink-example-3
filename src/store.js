import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default function() {
  return new Vuex.Store({
    state: {
      style: {},
      countries: [],
      selected: null,
      tripTime: null,
      exposed: null,
      centerCoords: null
    },
    getters: {
      style: state => state.style,
      countries: state => state.countries,
      selected: state => state.selected,
      tripTime: state => state.tripTime,
      exposed: state => state.exposed,
      centerCoords: state => state.centerCoords
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
      },
      setTripTime: (state, data) => {
        Vue.set(state, 'tripTime', data);
      },
      setExposed: (state, data) => {
        Vue.set(state, 'exposed', data);
      },
      setCenterCoords: (state, data) => {
        Vue.set(state, 'centerCoords', data);
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
      },
      setTripTime: async (context, data) => {
        context.commit('setTripTime', data);
      },
      setExposed: async (context, data) => {
        context.commit('setExposed', data);
      },
      setCenterCoords: async (context, data) => {
        context.commit('setCenterCoords', data);
      }
    }
  });
}
