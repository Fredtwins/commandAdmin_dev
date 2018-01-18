<template>
	<div class="single-atlas">
		<div class="single-atlas-warpper">
			<div class="atals-cascader">
				<Cascader :data="data" v-model="cascaderData" @on-change="cascaderChange" :clearable="false"></Cascader>
			</div>
			<a class="atals-download" :disabled="downDisabled" target="_blank" :href="downLoadHref">下载该月图册</a>
			<div class="atals-warpper">
				<ul class="atals-lists">
					<li 
						v-for="(item, key) in filterList"
						class="atals-detail">
						<div class="atals-title">{{key}}</div>
						<ul class="atals-imgs clear">
							<li 
								class="atals-img pull-left" 
								v-for="(img, index) in item">
								<div v-if="index < 3" class="normal">
									<img :src="img.url" @click="showAtals(item, index)" />
									<div>{{img.time}}</div>
								</div>
								<div v-else-if="index === 3" class="more">
									<img src="static/img/atlas/more.jpg" @click="showAtals(item, index)" />
									<div>共{{item.length}}张</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		
		<transition name="fade">
			<div class="atals-show" v-show="ifAtals">
				<div class="atals-show-warpper" @click="hideAtals">
					<div class="atals-close" @click="hideAtals">
						<Icon type="close"></Icon>
					</div>
					<div class="left-go" @click.stop="prevAtals">
						<Icon type="chevron-left"></Icon>
					</div>
					<div class="right-go" @click.stop="nextAtals">
						<Icon type="chevron-right"></Icon>
					</div>
					<div class="atlas-warpper" @click.stop>
						<ul class="atlas-showList">
							<li 
								v-for="(item, index) in atalsIng"
								class="atlas-showDetail" 
								:class="{'atlas-active': atalsIndex === index}">
								<div class="atlas-showTitle">{{item.time}}</div>
								<img :src="item.url"/>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</transition>
		
		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { loadingMixin } from 'common/js/mixins'
	import { calendarData } from 'common/js/module'
	import { errorNotice, errorMessage } from 'common/js/dom'
	import { ERR_OK, httpUrl, Static } from 'api/config'
	import { getTaskAtlasList } from 'api/single-atlas'
	
	export default {
		mixins: [loadingMixin],
		props: {
			name: {
				type: String,
				default: ''
			}
		},
		computed: {
//			filterList() {
//				let obj = {}
//				this.dataList.map(item => {
//					let strArr = item.split('/')
//					let date = strArr[2]
//					let time = strArr[3]
//					time = time.split('_')[0].substring(8, time.length).split('')
//					time = `${time[0]}${time[1]}:${time[2]}${time[3]}:${time[4]}${time[5]}`
//					
//					let data = {
//						time: time,
//						url: httpUrl + item.substring(1, item.length)
//					}
//					if(obj[date] === undefined) {
//						obj[date] = [data]
//					}else {
//						obj[date].push(data)
//					}
//				})
//				return obj
//			}
			filterList() {
				let obj = {}
				this.dataList.map(item => {
					let strArr = item.split('/')
					let date = strArr[strArr.length - 2]
					let time = strArr[strArr.length - 1]
					time = time.split('_')[0].substring(8, time.length).split('')
					time = `${time[0]}${time[1]}:${time[2]}${time[3]}:${time[4]}${time[5]}`
					
					let data = {
						time: time,
						url: item
					}
					if(obj[date] === undefined) {
						obj[date] = [data]
					}else {
						obj[date].push(data)
					}
				})
				return obj
			}
		},
		created() {
			this.searchObj['constructionid'] = this.name
			this.searchObj['ym'] = `${this.cascaderData[0]}-${this.cascaderData[1]}`
			
			this.getNewDownHref()

			this.search()
		},
		data() {
			return {
				searchObj: {},
				downLoadHref: '',
				data: calendarData,
				dataList: [],
				cascaderData: [this.getYear(), this.getMonth()],
				showLoading: false,
				ifAtals: false,
				downDisabled: false,
				atalsIng: [],
				atalsIndex: 0
			}
		},
		methods: {
			prevAtals() {
				if (this.atalsIndex === 0) {
					return 
				}
				this.atalsIndex--
			},
			nextAtals() {
				if (this.atalsIndex === this.atalsIng.length - 1) {
					return 
				}
				this.atalsIndex++
			},
			showAtals(item, index) {
				this.atalsIng = item
				this.atalsIndex = index
				this.ifAtals = true
			},
			hideAtals() {
				this.ifAtals = false
			},
			cascaderChange(time) {
				this.searchObj['ym'] = `${time[0]}-${time[1]}`
				this.getNewDownHref()
				this.search()	
			},
			getNewDownHref() {
				setTimeout(() => {
					this.downLoadHref = `${httpUrl}construction/download_buildatlas?constructionid=${this.name}&ym=${this.cascaderData[0]}-${this.cascaderData[1]}`					
				}, 20)
			},
			getYear() {
				return new Date().getFullYear()
			},
			getMonth() {
				let month = new Date().getMonth() + 1
				if (month < 10) {
					month = `0${month}`
				}
				return month
			},
			search() {
				let search = {
					...this.searchObj
				}
				this._getTaskAtlasList(search)
			},
			_getTaskAtlasList(search) {
				this.showLoading = true
				getTaskAtlasList(search).then(res => {
					if(res.code === ERR_OK) {
						this.dataList = res.result
						if (!this.dataList.length) {
							this.downDisabled = true
						}else {
							this.downDisabled = false
						}
					} else {
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
	@import url('~common/less/animate');
	
	.single-atlas {
		width: 100%;
		.single-atlas-warpper {
			width: 100%;
			position: relative;
			.atals-cascader {
				width: 200px;
				margin-bottom: 20px;
			}
			.atals-download {
				font-size: 12px;
				text-decoration: underline;
				position: absolute;
				left: 210px;
				top: 8px;
				cursor: pointer;
			}
			.atals-download:hover {
				color: @color-default;
			}
			.atals-warpper {
				.atals-lists {
					.atals-detail {
						.atals-title {
							font-size: 22px;
						}
						.atals-imgs {
							width: 380px;
							position: relative;
							.atals-img {
								width: 90px;
								margin-right: 5px;
								text-align: center;
								font-size: 14px;
								img {
									width: 100%;
									height: 120px;
								}								
							}
						}
					}
				}
			}		
		}
		.atals-show {
			z-index: 100;
			position: fixed;
			background-color: rgba(0, 0, 0, 0.8);
			top: 0;
			bottom: 0;
			left: 200px;
			right: 0;
			.atals-show-warpper {
				width: 100%;
				height: 100%;
				.atals-close {
					width: 20px;
					height: 26px;
					color: #7E7B7B;
					font-size: 26px;
					cursor: pointer;
					position: absolute;
					top: 50px;
					right: 50px;
				}
				.left-go, .right-go {
					width: 70px;
					height: 300px;
					text-align: center;
					line-height: 300px;
					color: #7E7B7B;
					font-size: 50px;
					cursor: pointer;
					position: absolute;
					top: 0;
					bottom: 0;
					margin: auto 0;
				}
				.left-go {
					left: 50px;
				}
				.right-go {
					right: 50px;
				}
				.left-go:hover, .right-go:hover, .atals-close:hover {
					color: white;
				}
				.atlas-warpper {
					width: 300px;
					height: 400px;
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					margin: auto;
					img {
						width: 100%;
					}
					.atlas-showList {
						width: 100%;
						.atlas-showDetail {
							display: none;
							.atlas-showTitle {
								width: 100%;
								text-align: center;
								position: absolute;
								font-size: 36px;
								color: white;
								top: -54px;
							}
						}
						.atlas-active {
							display: block;
						}
					}
				}
				@media only screen and (min-height: 676px) {
					.atlas-warpper {
						width: 400px;
						height: 534px;
					}
				}
			}
		}
	}
</style>