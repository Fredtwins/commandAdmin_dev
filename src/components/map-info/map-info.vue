<template>
	<div class="map-info">

		<div class="map">
			<el-amap-search-box 
				ref="amap-search" 
				class="search-box" 
				:search-option="searchOption" 
				:on-search-result="onSearchResult"></el-amap-search-box>
			<el-amap 
				ref="map" 
				vid="amapDemo" 
				:plugin="plugin" 
				:center="center" 
				:zoom="zoom" 
				mapStyle="fresh" 
				class="amap-demo">
				<el-amap-polygon 
					v-for="item in mapArea"
					:path="item"
					strokeWeight="5"
                    fillOpacity="0"
                    fillColor="#CCF3FF"
                    strokeColor="#CC66CC"></el-amap-polygon>
				<el-amap-marker 
					v-for="item in searchMarkers" 
					:position="item.pos"
					:title="item.title"
					:zIndex="998"></el-amap-marker>
				<el-amap-marker 
					v-for="item in siteMarkers" 
					:title="item.title"
					:position="item.pos" 
					:icon="item.icon" 
					:visible="siteShow"
					:clickable="true"
					:events="item.events"
					:zIndex="siteZIndex"></el-amap-marker>
				<el-amap-marker 
					v-for="item in sitingMarkers"
					:title="item.title"
					:position="item.pos" 
					:icon="item.icon" 
					:visible="sitingShow"
					:clickable="true"
					:events="item.events"
					:zIndex="sitingZIndex"></el-amap-marker>
				<el-amap-marker 
					v-for="item in noSiteMarkers" 
					:title="item.title"
					:position="item.pos" 
					:icon="item.icon" 
					:visible="noSiteShow"
					:clickable="true"
					:events="item.events"
					:zIndex="noSiteZIndex"></el-amap-marker>
				<el-amap-polyline 
					strokeColor="#008cee"
					zIndex="999"
					:visible="trackShow"
					:path="trackLine"></el-amap-polyline>
				<el-amap-marker 
					v-for="item in trackPoint" 
					zIndex="1000"
					:offset="[-12, -24]"
					:title="item.title"
					:visible="trackShow"
					:position="item.pos" 
					:icon="item.icon" 
					:clickable="true"
					:events="item.events"></el-amap-marker>
			</el-amap>
		</div>

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

		<loading v-show="showLoading"></loading>

		<patrol-track ref="patrol-track" @draw="draw"></patrol-track>
	</div>
</template>

<script>
	import patrolTrack from 'components/patrol-track/patrol-track'
	import { loadingMixin } from 'common/js/mixins'
	import { errorNotice } from 'common/js/dom'
	import { fnReadData } from 'common/js/module'
	import { setTaksIng, cloneObj } from 'common/js/util'
	import { Static, ERR_OK } from 'api/config'
	import { getTaskAllList } from 'api/task-management'

	export default {
		mixins: [loadingMixin],
		created() {
			this.defauleZIndex = 102
			
			this._getTaskAllList()
		},
		components: {
			'patrol-track': patrolTrack
		},
		mounted() {
			setTimeout(() => {
				this.initMapArea()
			}, 20)
		},
		data() {
			const center = [113.0445, 23.0607]
			return {
				plugin: [{
					pName: 'MapType',
					defaultType: 0
				}],
				center: cloneObj(center),
				zoom: 11,
				searchOption: {
					city: '佛山',
					citylimit: true
				},
				searchMarkers: [],
				mapArea: [],
				siteMarkers: [],
				sitingMarkers: [],
				noSiteMarkers: [],
				trackLine: [],
				trackPoint: [],
				siteZIndex: 100,
				sitingZIndex: 101,
				noSiteZIndex: 102,
				siteShow: true,
				sitingShow: true,
				noSiteShow: true,
				trackShow: false,
				fnReadData: fnReadData(),
				showLoading: false
			}
		},
		methods: {
			draw(res) {
				let lineList = []
				let pointList = []
				res.map(item => {
					if (item.construction && item.construction) {
						lineList.push([+item.construction.lnt, +item.construction.lat]);						
						pointList.push({
							pos: [+item.construction.lnt, +item.construction.lat],
							icon: `${Static}img/mapIcon/patrolMission.png`,
							title: item.construction.name,
							events: {
								'click': (e) => {
									this.click(item.construction)
								}
							}
						})
					}
				})
				this.trackLine = lineList
				this.trackPoint = pointList
			},
			onSearchResult(pois) {
				if(this.$refs['amap-search'].keyword === '') {
					this.searchMarkers = []
					return
				}
				let latSum = 0
				let lngSum = 0
				this.searchMarkers = []
				if(pois.length > 0) {
					pois.forEach(poi => {
						let {
							lng,
							lat
						} = poi;
						lngSum += lng
						latSum += lat
						this.searchMarkers.push({
							pos: [poi.lng, poi.lat],
							title: poi.name
						})
					})
					let center = {
						lng: lngSum / pois.length,
						lat: latSum / pois.length
					}
					this.center = [center.lng, center.lat]
				} else {
					this.center = cloneObj(center)
				}
			},
			fnClick(item) {
				let name = item.layerName
				item.checked = !item.checked
				switch(name) {
					case 'patrolMissionLayer':
						if(item.checked) {
							this.$refs['patrol-track'].showTrack()
							this.trackShow = true
						} else {
							this.$refs['patrol-track'].hideTrack()
							this.trackShow = false
						}
						break;
					default:
						if(item.checked) {
							this[`${name}ZIndex`] = ++this.defauleZIndex
							this[`${name}Show`] = true
						} else {
							this[`${name}Show`] = false
						}
						break;
				}
			},
			click(item) {
				setTaksIng(item)
				setTimeout(() => {
					this.$router.push(`/home/taskSingle/${item.constructionid}`)
				}, 20)
			},
			initMapArea() {
				let opts = {
	                subdistrict: 1,   
	                extensions: 'all',  
	                level: 'city'  
	            }
				let district = new AMap.DistrictSearch(opts)
				district.setLevel('district')
				
	            district.search('南海区',(status, result) => {
	                let bounds = result.districtList[0].boundaries
	                this.mapArea = bounds
	            })
			},
			_getTaskAllList() {
				this.showLoading = true
				getTaskAllList().then(res => {
					if (res.code === ERR_OK) {
						res.result.result.map(item => {
							switch(item.state) {
								case '已建':
									this.siteMarkers.push({
										pos: [item.lnt, item.lat],
										icon: `${Static}img/mapIcon/site.png`,
										title: item.name,
										events: {
											'click': (e) => {
												this.click(item)
											}
										}
									})
									break;
								case '在建':
									this.sitingMarkers.push({
										pos: [item.lnt, item.lat],
										icon: `${Static}img/mapIcon/siting.png`,
										title: item.name,
										events: {
											'click': (e) => {
												this.click(item)
											}
										}
									})
									break;
								case '规划中':
									this.noSiteMarkers.push({
										pos: [item.lnt, item.lat],
										icon: `${Static}img/mapIcon/noSite.png`,
										title: item.name,
										events: {
											'click': (e) => {
												this.click(item)
											}
										}
									})
									break;
							}
						})
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
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
			height: 100%;
			.search-box {
				position: absolute;
				top: 25px;
				left: 20px;
			}
		}
		.fn-read {
			position: absolute;
			top: 30px;
			right: 130px;
			user-select: none;
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
	}
</style>