<template>
  <canvas
    ref="my-canvas"
    :width="width"
    :height="height"
    style="border:1px solid #d3d3d3;"
    class="debug-border"
  />
</template>

<script>
import d3 from '../assets/d3';
import * as topojson from 'topojson-client';
import { cloneDeep } from 'lodash';

// import { Toto, Versor } from './geo';
import { Versor } from './geo';
import { setTimeout } from 'timers';
// import tutu from './geo';

export default {
  name: 'Globe',
  props: {},
  data() {
    return {
      g: {},
      //   dims: {},
      tilt: 0
    };
  },
  computed: {
    style() {
      return this.$store.getters['style'];
    },
    selected() {
      return this.$store.getters['selected'];
    },
    width() {
      return this.style.globe.width;
    },
    height() {
      return this.style.globe.height;
    }
  },
  watch: {
    selected: {
      handler: function(to, from) {
        if (!this.selected) return;
        this.travelTo(from, to);
      },
      immediate: true
    }
  },
  async created() {
    // console.log(tutu);
    // const t = Toto;
    // console.log(t);
    // console.log(t.addTwo(5));

    const world = await d3.json(
      'https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.json'
    );

    this.g.land = topojson.feature(world, world.objects.land);

    this.g.countries = topojson.feature(
      world,
      world.objects.countries
    ).features;

    this.g.idToCountry = this.g.countries.reduce((acc, cur) => {
      const obj = cloneDeep(acc);
      obj[cur.id] = cur;
      return obj;
    }, {});

    this.g.borders = topojson.mesh(
      world,
      world.objects.countries,
      (a, b) => a !== b
    );

    this.g.sphere = { type: 'Sphere' };

    this.g.tilt = 20;

    const atlas = await d3.tsv(
      'https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.tsv'
    );

    window.atlas = atlas;

    this.g.idToName = new Map(
      atlas.map(({ iso_n3, name_long }) => [iso_n3, name_long])
    );
    this.g.nameToId = new Map(
      atlas.map(({ iso_n3, name_long }) => [name_long, iso_n3])
    );

    const margin = 10;
    this.g.projection = d3
      .geoOrthographic()
      .fitExtent(
        [[margin, margin], [this.width - margin, this.height - margin]],
        this.g.sphere
      );

    // this.dims = {
    //   width: this.width,
    //   heigh: this.heigh
    // };

    const arrCountries = Array.from(this.g.idToName.values()).sort();
    console.log(arrCountries);

    this.$store.dispatch('setCountries', arrCountries);
  },

  mounted() {
    this.g.context = this.$refs['my-canvas'].getContext('2d');

    this.g.path = d3.geoPath(this.g.projection, this.g.context);

    const that = this;
    setTimeout(() => that.travelTo(null, 'Brazil'), 1000);

    // this.travelTo(null, 'France');

    // const c = this.$refs['my-canvas'];

    // const ctx = c.getContext('2d');
    // ctx.moveTo(0, 0);
    // ctx.lineTo(600, 400);
    // ctx.stroke();
  },
  methods: {
    async travelTo(fromName, toName) {
      console.log('travel from ', fromName, ' to ', toName);

      let fromId, fromCountry, r1, p1;
      if (fromName) {
        fromId = this.g.nameToId.get(fromName);
        fromCountry = this.g.idToCountry[toId];
        p1 = d3.geoCentroid(fromCountry);
        r1 = [-p1[0], this.tilt - p1[1], 0];
      } else {
        p1 = [0, 0];
        r1 = [0, 0, 0];
      }

      const toId = this.g.nameToId.get(toName);
      const toCountry = this.g.idToCountry[toId];
      const p2 = d3.geoCentroid(toCountry);
      const r2 = [-p2[0], this.tilt - p2[1], 0];

      const ip = d3.geoInterpolate(p1, p2);

      //   console.log(Versor);
      //   window.Versor = Versor;

      const iv = Versor.interpolateAngles(r1, r2);
      const country = toCountry;

      console.log(fromName);
      console.log(fromId);
      console.log(fromCountry);
      console.log(p1);
      console.log(r1);

      console.log(toName);
      console.log(toId);
      console.log(toCountry);
      console.log(p2);
      console.log(r2);

      console.log(toCountry);

      await d3
        .transition()
        .duration(1250)
        .tween('render', () => t => {
          this.g.projection.rotate(iv(t));
          this.render(country, {
            type: 'LineString',
            coordinates: [p1, ip(t)]
          });
        })
        .transition()
        .tween('render', () => t => {
          this.render(country, {
            type: 'LineString',
            coordinates: [ip(t), p2]
          });
        })
        .end();
    },
    render(country, arc) {
      console.log('start render');
      const ctx = this.g.context;
      const path = this.g.path;

      console.log(this.g.sphere);
      console.log(this.width);
      console.log(this.height);
      console.log(this.g.sphere);
      console.log(this.g.land);
      console.log(arc);

      ctx.clearRect(0, 0, this.width, this.height);
      ctx.beginPath(), path(this.g.land), (ctx.fillStyle = '#ccc'), ctx.fill();
      ctx.beginPath(),
        path(this.g.country),
        (ctx.fillStyle = '#f00'),
        ctx.fill();
      ctx.beginPath(),
        path(this.g.borders),
        (ctx.strokeStyle = '#fff'),
        (ctx.lineWidth = 0.5),
        ctx.stroke();
      ctx.beginPath(),
        // path(this.g.sphere),
        (ctx.strokeStyle = '#000'),
        (ctx.lineWidth = 1.5),
        ctx.stroke();
      ctx.beginPath(), path(arc), ctx.stroke();
      return ctx.canvas;
    }
  }
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
