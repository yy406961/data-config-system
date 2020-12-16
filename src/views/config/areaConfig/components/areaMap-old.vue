<!--
 * @Author: your name
 * @Date: 2020-12-01 14:31:25
 * @LastEditTime: 2020-12-02 10:14:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\config\areaConfig\components\areaMap.vue
-->
<template>
  <div :id="id" :style="mapStyle"></div>
</template>

<script>

import FreeDraw from 'leaflet-freedraw';

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

require("@/assets/js/tileLayer.baidu");
export default {
  name: "areaMap",
  props: {
    id: {
      type: String,
      default: 'map'
    },
    data: {
      type: Object,
      default: () => {
        return null
      }
    },
  },
  data() {
    return {
      map: null,
      polyLine: new L.LayerGroup(),
    }
  },
  created() {
    this.$nextTick(() => {
      // this.$set(this.data)
      this.initMap()
    })
  },
  methods: {
    //创建地图
    initMap() {
      console.log('aaaaaaa', this.id)
      this.map = L.map(this.id, {
        minZoom: 1,
        maxZoom: 18,
        center: [28.198195, 112.96843],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.Baidu,
      })
      // this.LayerGroup = new L.LayerGroup();
      L.tileLayer.baidu({ layer: 'custom', customid: 'googlelite' }).addTo(this.map);
      
      this.map.pm.setLang('zh');
      this.map.pm.addControls({
        position: 'topleft',
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: false,
        dragMode: false,
        cutPolygon: false,
        removeMode: false,
        oneBlock: true
      });
      
      this.map.on('pm:drawend', e => {
        console.log('画完', e);
      });
      // this.map.on('pm:drawstart', workingLayer => {
      //   console.log('画完', workingLayer);
      //   workingLayer.on('pm:update', e =>{
      //     console.log('编辑完', e);
      //   })
      // });

      this.map.on('pm:drawstart', ({ workingLayer }) => {
        console.log('开始画', workingLayer);
        workingLayer.on('pm:edit', e => {
          console.log('编辑完', e);
        });
      });
      
    },
  },
  computed: {
    mapStyle() {
      return {
        width: '100%',
        height: '100%'
      }
    },
  },
}
</script>