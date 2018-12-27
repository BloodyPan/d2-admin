<template>
  <d2-container>
    <el-card class="box-card" slot="header">
      <el-form ref="searchForm" :model="searchForm" label-width="120px" flex="dir:left main:left box:justify">
        <el-form-item
          label="手机/用户名"
          prop="username"
          :rules="[
            { required: true, message: '不能为空'}
          ]"
          class="margin-btm-0"
        >
          <el-input v-model="searchForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="form-item-search margin-btm-0">
          <el-button type="primary" @click="submitForm('searchForm')">查找</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card id="box" class="map-controler">
      <el-form ref="locationForm" :model="locationForm" label-width="50px">
        <el-form-item label="经度">
          <el-input v-model="locationForm.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
            <el-input v-model="locationForm.latitude"></el-input>
        </el-form-item>
      </el-form>
      <el-button style="width: 100%;" type="primary" @click="flyto" plain>Go</el-button>
    </el-card>
    <div id='map' class="map" :style="mapStyle">
    </div>
    <pre ref='coordinates' class='coordinates'></pre>
</d2-container>
</template>

<script>
import { SearchUser, UpdateLocation } from '@/api/pages/user/common'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/src/css/mapbox-gl.css'

export default {
  data () {
    return {
      searchForm: {
        username: '13800000666',
        center: true
      },
      users: {},
      locationForm: {
        longitude: 113.93818274,
        latitude: 22.51199144
      },
      mapStyle: '',
      flying: false,
      oriLngLat: [113.93818274, 22.51199144],
      accessToken: 'pk.eyJ1IjoidGhlcmVhbHJlbWFyayIsImEiOiJjajdhYWF0d3cwY3dkMnFuMGI1Y3dteDF5In0.QA6ng_dzDm3lATiomkOcrQ'
    }
  },
  mounted () {
    let that = this
    that.createMap()
  },
  methods: {
    createMap () {
      // 根据容器高度设置map高
      let mapHeight = document.getElementsByClassName('d2-container-full__body')[0].clientHeight
      this.mapStyle = 'height: ' + (mapHeight - 50) + 'px'

      mapboxgl.accessToken = this.accessToken
      mapboxgl.baseApiUrl = 'https://mb.getremark.com'
      // init the map
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/therealremark/cjp2cvuhk206s2rnw7928o5y9',
        minzoom: 2,
        center: this.oriLngLat,
        zoom: 14
      })
      this.map.dragRotate.disable()
      this.map.touchZoomRotate.disableRotation()

      // 删除右下角的logo
      let btnRight = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')
      if (btnRight.length > 0) {
        btnRight[0].remove()
      }

      this.createCrossHair()
    },
    createCrossHair () {
      // 生成地图中心十字，并保持一直在地图中央位置
      let el = document.createElement('div')
      el.setAttribute('id', 'crossHairDiv')
      el.innerHTML = '<div id="crossHair" class="cross-hair">+</div>'
      this.crossHair = new mapboxgl.Marker(el).setLngLat(this.oriLngLat).addTo(this.map)
      this.map.on('drag', this.keepCrossHairCenter)
      this.map.on('zoom', this.keepCrossHairCenter)
      this.map.on('mousedown', this.mapClicked)
    },
    getCenter () {
      let point = this.map.getCenter()
      return [point.lng, point.lat]
    },
    mapClicked () {
      // mousedown重置flying标志位
      this.flying = false
      this.updateMapControler()
    },
    keepCrossHairCenter () {
      var that = this
      that.updateMapControler()
      // flyto时候不触发下面代码; map.stop()会中断flyto
      if (!this.flying) {
        setTimeout(function () {
          that.map.stop()
          that.updateMapControler()
        }, 200)
      }
    },
    updateMapControler () {
      // 跳转十字位置
      var point = this.getCenter()
      this.crossHair.setLngLat(point)
      this.locationForm.longitude = parseFloat(point[0].toFixed(8))
      this.locationForm.latitude = parseFloat(point[1].toFixed(8))
    },
    flyto () {
      let centerPoint = [this.locationForm.longitude, this.locationForm.latitude]
      this.flying = true
      this.map.flyTo({center: centerPoint, speed: 10, zoom: 14})
      this.crossHair.setLngLat(centerPoint)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.searchApi()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async searchApi () {
      const res = await SearchUser({
        query: this.searchForm.username
      })

      if (res !== void 0 && res.user !== void 0) {
        if (this.users[res.user.username] !== void 0) {
          this.$notify({
            title: res.user.username + ' 已经添加到地图上了',
            message: '',
            duration: 2000,
            type: 'info'
          })
          return
        }
        let username = res.user.username

        // 头像marker的dom结构
        let el = document.createElement('div')
        el.setAttribute('id', username)
        el.innerHTML = '<div ref="' + username + '" class="map-profile-div"><i id="del' + username + '" class="el-icon-delete map-profile-remove"></i><i id="save' + username + '"class="el-icon-check map-profile-save"></i><img class="map-profile" src="' + res.user.profilePhoto + '"></div>'
        // 没有地理位置就拿当前中心点
        // let noLocation = (res.user.longitude || res.user.latitude) == 0
        // let userLngLat = [res.user.longitude, res.user.latitude]
        // userLngLat = noLocation ? this.getCenter() : userLngLat
        let userLngLat = this.getCenter()

        // marker添加到地图，并注册事件
        let marker = new mapboxgl.Marker(el).setLngLat(userLngLat).setDraggable(true)
        marker.addTo(this.map)
        marker.on('dragend', this.onDragEnd)

        var that = this
        document.getElementById('del' + res.user.username).onclick = function () {
          that.removeMarker(username)
        }
        document.getElementById('save' + res.user.username).onclick = function () {
          that.saveUserLocation(username)
        }

        // 记录下用户的经纬度 和 marker对象
        this.users[res.user.username] = {
          lng: res.user.longitude,
          lat: res.user.latitude,
          marker: marker
        }
      }
    },
    removeMarker (username) {
      this.users[username].marker.remove()
      delete this.users[username]
      this.$refs.coordinates.style.display = 'none'
    },
    async saveUserLocation (username) {
      let user = this.users[username]
      const res = await UpdateLocation({
        username: username,
        latitude: user.latitude,
        longitude: user.longitude
      })

      this.$notify({
        title: res.msg,
        message: '',
        duration: 2000,
        type: 'success'
      })
    },
    onDragEnd (event) {
      let username = event.target._element.id
      let user = this.users[username]
      let lngLat = user.marker.getLngLat()
      user.latitude = parseFloat(lngLat.lat.toFixed(8))
      user.longitude = parseFloat(lngLat.lng.toFixed(8))
      this.$refs.coordinates.style.display = 'block'
      this.$refs.coordinates.innerHTML = '用户: ' + username + '<br/>经度: ' + parseFloat(lngLat.lng.toFixed(8)) + '<br/>纬度: ' + parseFloat(lngLat.lat.toFixed(8))
    }
  }
}
</script>

<style scoped>
  .map {
    width: 100;
    height: 70vh;
  }

  .margin-btm-0 {
    margin-bottom: 0;
  }

  .cross-hair{
    display: inline-block;
    font-size: 50px;
    color: red;
  }

  .map-controler {
    width: 280px;
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 1000;
  }

  .coordinates {
    background: rgba(0,0,0,0.5);
    color: #fff;
    position: absolute;
    top: 20px;
    right: 20px;
    padding:5px 10px;
    margin: 0;
    font-size: 11px;
    line-height: 18px;
    border-radius: 3px;
    display: none;
  }
</style>

<style lang="scss">
  .cross-hair{
    display: inline-block;
    font-size: 50px;
    color: red;
  }

  .map-profile-div{
    position: relative;
    z-index: 1;
  }

  .map-profile{
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 4px solid #FF6A00;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .map-profile-remove {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 14px;
    font-weight: bolder;
    cursor: pointer;
    background-color: #f56c6c;
    padding: 8px;
    color: white;
    border-radius: 50%;
  }

  .map-profile-save {
    position: absolute;
    bottom: 0;
    right: -5px;
    font-size: 14px;
    font-weight: bolder;
    cursor: pointer;
    background-color: #96d676;
    padding: 8px;
    color: white;
    border-radius: 50%;
  }

  .form-item-search {
    .el-form-item__content {
      margin-left: 10px !important;
    }
  }

  .map-controler {
    .el-form-item {
      margin-bottom: 12px !important;
    }
  }
</style>
