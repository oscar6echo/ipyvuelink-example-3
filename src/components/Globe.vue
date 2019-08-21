<template>
  <canvas
    ref="my-canvas"
    :width="width"
    :height="height"
    class="debug-border"
  />
</template>

<script>
import d3 from '../assets/d3';
import * as topojson from 'topojson-client';
import { cloneDeep } from 'lodash';
import { Versor } from './geo';

export default {
  name: 'Globe',
  props: {},
  data() {
    return {
      g: {},
      tilt: 0,
      isMounted: false
    };
  },
  computed: {
    style() {
      return this.$store.getters['style'];
    },
    selected() {
      return this.$store.getters['selected'];
    },
    tripTime() {
      return this.$store.getters['tripTime'] * 1000;
    },
    width() {
      return this.style.globe.width;
    },
    height() {
      return this.style.globe.height;
    }
  },
  watch: {
    isMounted: {
      handler: function() {
        this.setUpCanvas();
      },
      immediate: true
    },
    style: {
      handler: function() {
        this.setUpCanvas();
      },
      immediate: true
    },
    selected: {
      handler: function(to, from) {
        if (!this.selected) return;
        this.travelTo(from, to);
      },
      immediate: true
    }
  },
  async created() {
    this.g.sphere = { type: 'Sphere' };

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

    const arrCountries = Array.from(this.g.idToName.values()).sort();
    // console.log(arrCountries);

    this.$store.dispatch('setCountries', arrCountries);
  },

  mounted() {
    this.isMounted = true;
  },

  methods: {
    setUpCanvas() {
      console.log('setUpCanvas');
      if (!(this.width && this.height && this.isMounted)) {
        // console.log(this.width);
        // console.log(this.height);
        // console.log(this.isMounted);
        // console.log('abort setUpCanvas');
        return;
      }

      const margin = 10;
      this.g.projection = d3
        .geoOrthographic()
        .fitExtent(
          [[margin, margin], [this.width - margin, this.height - margin]],
          this.g.sphere
        );

      this.g.context = this.$refs['my-canvas'].getContext('2d');
      this.g.path = d3.geoPath(this.g.projection, this.g.context);

      window.ctx = this.g.context;
      window.path = this.g.path;
      window.projection = this.g.projection;

      this.travelTo(null, null);
    },
    async travelTo(fromName, toName) {
      console.log('travel from ', fromName, ' to ', toName);

      //   if (!fromName & !toName) return;

      let fromId, fromCountry, r1, p1;
      if (fromName) {
        fromId = this.g.nameToId.get(fromName);
        fromCountry = this.g.idToCountry[fromId];
        p1 = d3.geoCentroid(fromCountry);
        r1 = [-p1[0], this.tilt - p1[1], 0];
      } else {
        p1 = [0, 0];
        r1 = [0, 0, 0];
      }

      let toId, toCountry, r2, p2;
      if (toName) {
        toId = this.g.nameToId.get(toName);
        toCountry = this.g.idToCountry[toId];
        p2 = d3.geoCentroid(toCountry);
        r2 = [-p2[0], this.tilt - p2[1], 0];
      } else {
        p2 = [0, 0];
        r2 = [0, 0, 0];
      }

      const ip = d3.geoInterpolate(p1, p2);

      const iv = Versor.interpolateAngles(r1, r2);
      const country = toCountry;

      const exposed = {
        country: toName,
        centerCoords: p2
      };
      console.log(exposed);
      this.$store.dispatch('setExposed', exposed);
      this.$store.dispatch('setCenterCoords', p2);

      //   console.log(fromName);
      //   console.log(fromId);
      //   console.log(fromCountry);
      //   console.log(p1);
      //   console.log(r1);

      //   console.log(toName);
      //   console.log(toId);
      //   console.log(toCountry);
      //   console.log(p2);
      //   console.log(r2);

      //   console.log(toCountry);

      await d3
        .transition()
        .duration(this.tripTime || 1000)
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
      const ctx = this.g.context;
      const path = this.g.path;

      ctx.clearRect(0, 0, this.width, this.height);

      ctx.beginPath(), path(this.g.land), (ctx.fillStyle = '#ccc'), ctx.fill();

      ctx.beginPath(), path(country), (ctx.fillStyle = '#f00'), ctx.fill();

      ctx.beginPath(),
        path(this.g.borders),
        (ctx.strokeStyle = '#fff'),
        (ctx.lineWidth = 0.5),
        ctx.stroke();

      ctx.beginPath(),
        path(this.g.sphere),
        (ctx.strokeStyle = '#000'),
        (ctx.lineWidth = 1.0),
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
  /* width: 600px;
  height: 100%; */

  background-color: 'green';
}
</style>
