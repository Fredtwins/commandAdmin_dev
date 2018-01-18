// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

/* 项目入口文件
 * @ 劳兆城 
 * @ 2017-07-24 */

import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import store from './store'
import axios from 'axios'
import iView from 'iView'
import AMap from 'vue-amap'
import 'iview/dist/styles/iview.css'
import 'common/less/reset.less'
import 'common/less/icon.less'
import 'common/less/loading.less'

Vue.config.productionTip = false

Vue.use(iView)

Vue.use(AMap)

AMap.initAMapApiLoader({
  key: 'd6927d6dd25f5183577d1978c2faae00',
  plugin: ['Geocoder', 'MouseTool', 'MapType', 'DistrictSearch']
})

new Vue({
	el: '#buildSite',
	router,
	store,
	template: '<App/>',
	components: { App }
})