<template>
	<div class="map-info">

		<div class="map" ref="map"></div>

		<div class="fn-read">
			<div class="fn-read-warpper">
				<ul class="fn-lists clear">
					<li v-for="item in fnReadData" class="fn-list pull-left" @click="fnClick(item)">
						<img :src="item.img" />
						<div>{{item.title}}</div>
						<div class="fn-list-checked" v-show="item.checked">
							<div class="fn-list-checked-icon">
								<Icon type="checkmark-round"></Icon>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<ul class="layers">
			<li class="layer" :class="{'layer-active': layerActive === 'normal'}" @click="layerClick('normal')">
				<span>平面图</span>
			</li>
			<li class="layer" :class="{'layer-active': layerActive === 'earth'}" @click="layerClick('earth')">
				<span>地形图</span>
			</li>
			<li class="layer" :class="{'layer-active': layerActive === 'panorama'}" @click="layerClick('panorama')">
				<span>卫星图</span>
			</li>
		</ul>

		<loading v-show="showLoading"></loading>

		<patrol-track ref="patrol-track" @draw="draw"></patrol-track>
	</div>
</template>

<script>
	import patrolTrack from 'components/patrol-track/patrol-track'
	import { loadingMixin } from 'common/js/mixins'
	import { errorNotice } from 'common/js/dom'
	import { fnReadData } from 'common/js/module'
	import { setTaksIng } from 'common/js/util'
	import { ERR_OK } from 'api/config'
	import { createMap, getLayer, drawPointFeature } from 'api/map'

	let layers = {};

	export default {
		mixins: [loadingMixin],
		created() {
			this.lineStyle = {
				strokeColor: "#00FF00",
				strokeWidth: 3,
				strokeDashstyle: "dashdot",
				pointRadius: 6,
				pointerEvents: "visiblePainted"
			};
		},
		components: {
			'patrol-track': patrolTrack
		},
		mounted() {
			setTimeout(() => {
				this.initMap()
			}, 20)
		},
		data() {
			return {
				layerActive: 'earth',
				fnReadData: fnReadData(),
				showLoading: false
			}
		},
		methods: {
			draw(res) {
				layers.lineLayer.getSource().clear()
				layers.pointLayer.getSource().clear()
				
				var pointList = []
				res.map(item => {
					if (item.construction && item.construction) {
						pointList.push([+item.construction.lnt, +item.construction.lat]);						
					}
				})
				
				var feature = new ol.Feature({
					geometry: new ol.geom.LineString(pointList)
				})

				layers.lineLayer.getSource().addFeature(feature)
				
				layers.pointLayer.getSource().addFeatures(drawPointFeature(res))
			},
			fnClick(item) {
				item.checked = !item.checked
				switch(item.layerName) {
					case 'patrolMissionLayer':
						if(item.checked) {
							this.$refs['patrol-track'].showTrack()
							layers.Map.addLayer(layers.lineLayer)
							layers.Map.addLayer(layers.pointLayer)
						} else {
							this.$refs['patrol-track'].hideTrack()
							layers.Map.removeLayer(layers.lineLayer)
							layers.Map.removeLayer(layers.pointLayer)
						}
						break;
					default:
						if(item.checked) {
							this.addLayer(item.layerName)
						} else {
							this.removeLayer(item.layerName)
						}
						break;
				}
			},
			addLayer(layerName) {
				layers.Map.addLayer(layers[layerName])
			},
			removeLayer(layerName) {
				layers.Map.removeLayer(layers[layerName])
			},
			initMap() {
				this.showLoading = true

				layers.baseLayer = getLayer('baseLayer')
				layers.heightLayer = getLayer('heightLayer')
				layers.GdPanoramaLayer = getLayer('GdPanoramaLayer')
				layers.FsPanoramaLayer = getLayer('FsPanoramaLayer')
				layers.FsNhLayer = getLayer('FsNhLayer')
				layers.notionLayer = getLayer('notionLayer')

				layers.heightLayer.setVisible(true)

				layers.Map = createMap(this.$refs.map, [layers.baseLayer, layers.heightLayer, layers.GdPanoramaLayer, layers.FsPanoramaLayer, layers.FsNhLayer, layers.notionLayer])
				
				layers.lineLayer = new ol.layer.Vector({
					style: [new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: '#0099ff',
							width: 3
						})
					})],
					source: new ol.source.Vector({
						features: []
					}),
					name: 'lineLayer'
				})
				
				layers.pointLayer = new ol.layer.Vector({
					style: function(feature) {
						return feature.get('style');
					},
					source: new ol.source.Vector({
						features: []
					}),
					name: 'pointLayer'
				})
				
				this.initMapClick()

				getLayer('sitesLayer').then(res => {
					if(res.code === ERR_OK) {
						for(let key in res.layer) {
							layers[key] = res.layer[key]
							layers.Map.addLayer(layers[key])
						}
					} else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			initMapClick() {
				layers.Map.on('singleclick', (event) => {
					let pixel = event.pixel
					let lat = event.coordinate[0]
					let lng = event.coordinate[1]
					let features = []
					let layerNames = []

					layers.Map.forEachFeatureAtPixel(pixel, function(feature, layer) {
						features.push(feature)
						if(layer) {
							layerNames.push(layer.get('name') === null ? "" : layer.get('name'))
						}
					})

					if(features.length) {
						let layer = layerNames[0]
						
						if (layer === 'lineLayer' || layer === 'pointLayer') {
							return
						}
						
						let info = features[0].get('content')
						setTaksIng(info)
						this.$router.push(`/home/taskSingle/${info.constructionid}`)
					}
				})
			},
			layerClick(name) {
				if(name === this.layerActive) {
					return
				}
				let obj = {}
				switch(name) {
					case 'normal':
						obj = {
							base: true,
							height: false,
							panorama: false
						}
						break
					case 'earth':
						obj = {
							base: false,
							height: true,
							panorama: false
						}
						break
					case 'panorama':
						obj = {
							base: false,
							height: false,
							panorama: true
						}
						break
				}
				this.layerChange(obj)
				this.layerActive = name
			},
			layerChange(obj) {
				layers.baseLayer.setVisible(obj.base)
				layers.heightLayer.setVisible(obj.height)
				layers.GdPanoramaLayer.setVisible(obj.panorama)
				layers.FsPanoramaLayer.setVisible(obj.panorama)
				layers.FsNhLayer.setVisible(obj.panorama)
			}
		}
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');
	.map-info {
		width: 100%;
		height: 100%;
		.map {
			width: 100%;
			height: 100%
		}
		.fn-read {
			position: absolute;
			top: 80px;
			right: 50px;
			.fn-read-warpper {
				.fn-lists {
					.fn-list {
						width: 65px;
						height: 65px;
						padding: 5px 0;
						font-size: 12px;
						text-align: center;
						cursor: pointer;
						position: relative;
						margin-right: 5px;
						background-color: rgb(238, 238, 238);
						img {
							width: 35px;
							height: 35px;
							margin-bottom: 5px;
						}
						.fn-list-checked {
							width: 100%;
							height: 100%;
							border: 1px solid @color-default;
							position: absolute;
							left: 0;
							top: 0;
							.fn-list-checked-icon {
								width: 18px;
								height: 18px;
								text-align: center;
								background-color: @color-default;
								color: white;
								transform: scale(.8);
								position: absolute;
								right: -2px;
								top: -2px;
							}
						}
					}
					.fn-list:nth-last-of-type(1) {
						margin-right: 0;
					}
				}
			}
		}
		.layers {
			width: 118px;
			height: 66px;
			background-color: rgba(55, 55, 55, .1);
			transition: all .4s;
			position: fixed;
			right: 10px;
			bottom: 10px;
			padding: 8px;
			user-select: none;
			.layer {
				width: 80px;
				height: 50px;
				transition: all .4s;
				border: 1px solid white;
				background-size: 100% 100%;
				position: absolute;
				cursor: pointer;
				span {
					position: absolute;
					bottom: 0;
					right: 0;
					color: white;
					font-size: 12px;
					transition: all .4s;
				}
			}
			.layer:hover {
				transform: scale(1.2);
			}
			.layer:hover,
			.layer-active {
				border: 1px solid @color-default;
				span {
					background-color: @color-default;
				}
			}
			.layer:nth-of-type(1) {
				right: 28px;
				background-image: url(./img/maptypeNormal.png);
			}
			.layer:nth-of-type(2) {
				right: 18px;
				background-image: url(./img/maptypeEarth.png);
			}
			.layer:nth-of-type(3) {
				right: 8px;
				background-image: url(./img/maptypePanorama.png);
			}
		}
		.layers:hover {
			width: 278px;
			.layer:nth-of-type(1) {
				right: 188px;
			}
			.layer:nth-of-type(2) {
				right: 98px;
			}
		}
	}
</style>