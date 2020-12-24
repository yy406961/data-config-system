<!--
 * @Author: your name
 * @Date: 2020-12-02 10:34:05
 * @LastEditTime: 2020-12-16 10:44:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\config\areaConfig\components\areaMap.vue
-->
<template>
  <div class="areaMap">
    <div :id="id" :style="mapStyle"></div>
    <div v-if="mapTool" class="areaMapBtn">
      <el-button size="mini" type="primary" @click="clearArea">清除已框选区域</el-button>
    </div>
  </div>
</template>

<script>
import { uliList } from '@/api/config'
import BMapLib from 'BMapLib'
const CIRCLE = './js/gis/images/red.png'
export default {
  name: "areaMap",
  props: {
    id: {
      type: String,
      default: 'map'
    },
    // 是否显示画图功能
    mapTool: {
      type: Boolean,
      default: false
    },
    // 地图边界数据 areaBorder 和 地图基站点数据 cellInfo
    option: {
      type: Object,
      default: () => {
        return null
      }
    },
  },
  data() {
    return {
      map: null,
      overlays: [],
      styleOptions: {
        strokeColor: '#159BAC', // 边线颜色。
        fillColor: '#159BAC', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.35, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      },
      drawingMode: '',
      mapLength: null,
      drawingManager: {},
      clearOption: false,
      getOverlay: null,
      polygon: null,
      circle: null,
      icon: [CIRCLE],
    }
  },
  watch: {
    option: {
      handler: function (val){
        this.createPolygon(val)
      },
      deep: true
    },
    mapTool(newVal) {
      if (newVal) {
        $('.BMapLib_Drawing_panel').css({
          'display': 'block'
        })
      } else {
        this.editMap()
        $('.BMapLib_Drawing_panel').css({
          'display': 'none'
        })
      }
    }
  },
  mounted() {
    this.createMap()
  },
  methods: {
    // 清除已框选区域
    clearArea() {
      if (this.isDrawingState()) {
        this.$message.warning('请编辑结束后再清除')
      } else {
        this.editMap()
        this.clearAll()
        this.map.clearOverlays()
        this.overlays = []
      }
    },
    //创建地图
    createMap() {
      this.map = new BMap.Map(this.id, { minZoom: 3, maxZoom: 18 })
      // 清除所有覆盖物
      this.map.clearOverlays()
      // 找中心点坐标
      const poi = new BMap.Point(112.96843, 28.198195)
      this.map.centerAndZoom(poi, 14)
      this.map.enableScrollWheelZoom()
      // 实例化鼠标绘制工具
      this.drawingManager = new window.BMapLib.DrawingManager(this.map, {
          isOpen: false, // 是否开启绘制模式
          enableDrawingTool: true, // 是否显示工具栏
          drawingToolOptions: {
              anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
              offset: new BMap.Size(5, 5), // 偏离值
              // 鼠标绘制工具
              drawingModes: [
                  window.BMAP_DRAWING_POLYGON,
                  window.BMAP_DRAWING_CIRCLE,
                  window.BMAP_DRAWING_RECTANGLE
              ]
          },
          circleOptions: this.styleOptions, // 圆的样式
          polylineOptions: this.styleOptions, // 线的样式
          polygonOptions: this.styleOptions, // 多边形的样式
          rectangleOptions: this.styleOptions // 矩形的样式
      })
      this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete)
      // 默认隐藏
      $('.BMapLib_Drawing_panel').css({
          'display': 'none'
      })
    },
    // 鼠标画图时触发的方法
    overlaycomplete(e) {
      if (this.overlays.length === 1) {
        this.$message.warning('每次只能框选一个区域,请清楚已框选区域后重新框选')
        this.editMap()
        this.map.removeOverlay(e.overlay);
        return;
      }
      // 获取鼠标画图工具（圆形、多边形）
      this.drawingMode = e.drawingMode
      this.overlays.push(e.overlay)
      this.mapLength = this.overlays.length
      this.getOverlay = e.overlay
      // 关闭画图工具(关闭之后才可以进行编辑图形操作)
      this.editMap()
      // 画完区域后获取区域的基站点
      this.getUliData()
    },
    editMap() {
      this.drawingManager.close()
      if (this.getOverlay) this.getOverlay.enableEditing()
    },
    // 判断是否为绘制状态 如果“是”的话 阻止操作
    isDrawingState() {
      if (this.drawingManager) return this.drawingManager._isOpen
    },
    // // 画完区域后获取区域的基站点
    getUliData() {
      this.areaBorder = this.getOverLayData()
      uliList(this.areaBorder).then( res => {
        if (res.data.length) {
          this.drawPoint(res.data)
        }
      })
    },
    // 清除所有覆盖物
    clearAll() {
      for (var i = 0; i < this.overlays.length; i++) {
        this.map.removeOverlay(this.overlays[i])
      }
      this.overlays.length = 0
      this.clearOption = true
      this.getOverlay = null
      this.polygon = null
      this.circle = null
      this.map.clearOverlays()
    },
    // 获取鼠标框选区域的信息
    getOverLayData() {
      if (this.getOverlay) {
        this.getOverlay.disableEditing()
          if (this.drawingMode === 'circle') {
            // 框选圆形区域
            // 获取圆的中心点和半径
            let radius = this.getOverlay.getRadius()
            let lng = this.getOverlay.getCenter().lng
            let lat = this.getOverlay.getCenter().lat
            // let area = 3.1415926 * radius * radius / 1000000
            let pathObj = {
              radius: radius + '',
              areaCoverage: `${lng} ${lat}`,
              // acreage: area
            }
            return pathObj
          } else {
            // 框选多边形区域
            // 获取多边形顶点的坐标
            let path = this.getOverlay.getPath()
            let arr = []
            path.forEach(item => {
                arr.push(`${item.lng} ${item.lat}`)
            })
            // 获取多边形的面积
            let ply = new BMap.Polygon(path)
            // let area = BMapLib.GeoUtils.getPolygonArea(ply) / 1000000
            let pathObj = {
              radius: '0',
              areaCoverage: arr.join(','),
              // acreage: area
            }
            return pathObj
          }
      }
      return null
    },
    // 画多边形
    createPolygon(option) {
        // 清除所有覆盖物
      this.map.clearOverlays()
      let { areaBorder } = option
      let markData = []
        // 取基站点信息
      option.cellInfo.map(item => {
          markData.push(item)
      })
      // 打点
      if (markData.length) {
        this.drawPoint(markData)
      }
      let mapData = []
      // 画区域边界
      areaBorder.map(item => {
        mapData.push(item)
      })
      if (mapData.length) {
          // 画圆形区域
          if (mapData.length === 1) {
              let borderData = mapData[0]
              // let borderData = JSON.parse(mapData[0])
              let point = new BMap.Point(borderData.lon, borderData.lat)
              // 根据接收的坐标重新找地图中心点
              this.map.panTo(point)
              this.map.enableScrollWheelZoom()
              let pointCircle = {
                  lng: borderData.lon,
                  lat: borderData.lat
              }
              // 创建圆形
              this.circle = new BMap.Circle(pointCircle, option.radius, this.styleOptions)
              // 添加圆形覆盖物
              this.map.addOverlay(this.circle)
              // 将覆盖物push到overlays里面（判断覆盖物的个数）
              this.overlays.push(this.circle)
          } else {
              // 画多边形区域
              // let borderData = JSON.parse(mapData[0])
              let borderData = mapData[0]
              if (borderData) {
                let center = new BMap.Point(borderData.lon, borderData.lat)
                this.map.panTo(center)
                this.map.enableScrollWheelZoom()
                let points = []
                for (var i = 0; i < mapData.length; i++) {
                  points.push(
                    new BMap.Point(
                      mapData[i].lon,
                      mapData[i].lat
                    )
                  )
                }
                this.polygon = new BMap.Polygon(points, this.styleOptions) // 创建多边形
                this.map.addOverlay(this.polygon)
                this.overlays.push(this.polygon)
              }
          }
      }
    },
    // 画点
    drawPoint(markData) {
      this.map.enableScrollWheelZoom()
      for (let i = 0; i < markData.length; i++) {
        // let itemPoint = JSON.parse(markData[i])
        let itemPoint = markData[i]
        if (itemPoint) {
          let { lat, lon } = itemPoint
          let myIcon = new BMap.Icon(this.icon[0], new BMap.Size(25, 29))
          let point = new BMap.Point(Number(lon), Number(lat))
          let marker = new BMap.Marker(point, { icon: myIcon })
          this.map.addOverlay(marker)
          // let me = this
          // marker.addEventListener('click', function(e) {
          //     me.showDetail(itemPoint, e.target)
          // })
        }
      }
    },
    // 多边形区域可修改
    areaEdit() {
      if (this.polygon) {
        this.polygon.enableEditing()
      }
      if (this.circle) {
        this.circle.enableEditing()
      }
    },
    // 修改时点取消重新画地图边框和基站点
    redraw() {
      this.createPolygon(this.option)
    },
    // 获取修改的覆盖物数据
    getModifyBorder() {
      if (this.polygon) {
        let path = this.polygon.getPath()
        let arr = []
        path.forEach(item => {
          arr.push(`${item.lng} ${item.lat}`)
        })
        let pathObj = {
          radius: '0',
          areaCoverage: arr.join(',')
        }
        return pathObj
      } else if (this.circle) {
        let lng = this.circle.getCenter().lng
        let lat = this.circle.getCenter().lat
        let radius = this.circle.getRadius()
        let pathObj = {
          radius: radius + '',
          areaCoverage: `${lng} ${lat}`
        }
        return pathObj
      } else {
        return null
      }
    }
  },
  beforeDestory() {
    this.map = null
    this.overlays = []
    this.drawingManager = null
    this.polygon = null
    this.circle = null
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

<style scoped lang="scss">
.areaMap {
  width: 100%;
  height: 100%;
  position: relative;
  .areaMapBtn {
    position: absolute;
    top: 58px;
    right: 138px;
  }
}
</style>