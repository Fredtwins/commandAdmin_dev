<template>
	<div class="single-mission">
		<div class="single-mission-warpper clear">
			<div class="calendar" ref="calendar">
				<div class="calendar-warpper">
					<div class="calendar-cascader">
						<Cascader :data="data" v-model="cascaderData" @on-change="cascaderChange" :clearable="false"></Cascader>
					</div>
					<div class="calendar-status">
						<ul class="calendar-statusLists clear">
							<li class="calendar-statusList pull-left">
								<div class="status status-success"></div>
								<div class="status-title">已完成</div>
							</li>
							<li class="calendar-statusList pull-left">
								<div class="status status-error"></div>
								<div class="status-title">有隐患</div>
							</li>
						</ul>
					</div>
					<div class="calendar-header">
						<ul class="calendar-header-lists clear">
							<li class="calendar-list calendar-headList pull-left">日</li>
							<li class="calendar-list calendar-headList pull-left">一</li>
							<li class="calendar-list calendar-headList pull-left">二</li>
							<li class="calendar-list calendar-headList pull-left">三</li>
							<li class="calendar-list calendar-headList pull-left">四</li>
							<li class="calendar-list calendar-headList pull-left">五</li>
							<li class="calendar-list calendar-headList pull-left">六</li>
						</ul>
					</div>
					<div class="calendar-content">
						<ul class="calendar-content-lists clear">
							<li 
								class="calendar-list pull-left" 
								:class="{
									'calendar-haveList': item.index, 
									'today-active': monthActive && getDate() === item.index
								}" 
								v-for="item in dateData"
								@click="calendarClick(item)">
								<div class="date">{{item.index}}</div>
								<div class="date-warpper" v-if="item.data">
									<div class="calendar-person">
										<div class="calendar-personInfo">
											<div class="calendar-personName">{{item.data[0].inspector.realname}}</div>
											<div 
												class="calendar-personStatus" 
												:class="{
													'calendar-personStatus-error': item.data[0].state === '有隐患',
													'calendar-personStatus-success': item.data[0].state !== '有隐患'
												}"></div>											
										</div>
										<div class="calendar-personDate">{{item.data[0].time}}</div>
									</div>
								</div>
								<div class="canlendar-border" v-if="item.index"></div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		
		<interact-model
			ref="more-model" 
			class="more-model" 
			:title="moreTitle">
			<div class="table">
				<div class="table-warpper">
					<Table 
						border 
						highlight-row
						size="small" 
						:columns="tableThead" 
						:data="tableTbody"></Table>	
				</div>
			</div>
		</interact-model>
		
		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { loadingMixin, interactModelMixin, calendarMixin } from 'common/js/mixins'
	import { patrolMissionThead } from 'common/js/table'
	import { errorNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getSingleMissionList } from 'api/patrol-mission'

	export default {
		mixins: [loadingMixin, interactModelMixin, calendarMixin],
		props: {
			name: {
				type: String,
				default: ''
			}
		},
		computed: {
			filterList() {
				let obj = {}

				this.dataList.map(item => {
					if(obj[item.ymd] === undefined) {
						item.time = item.date_time.split(' ')[1]
						obj[item.ymd] = [item]
					} else {
						item.time = item.date_time.split(' ')[1]
						obj[item.ymd].push(item)
					}
				})
				return obj
			}
		},
		created() {
			this.searchObj['construction.constructionid'] = this.name
			this.searchObj['ym'] = `${this.cascaderData[0]}-${this.cascaderData[1]}`

			this.search()
		},
		data() {
			return {
				searchObj: {},
				moreTitle: '',
				tableThead: patrolMissionThead(this),
				tableTbody: [],
				showLoading: false
			}
		},
		methods: {
			calendarClick(item) {
				this.moreTitle = item.date
				this.tableTbody = item.data
				this.$refs['more-model'].showModel()
			},
			cascaderChange(time) {
				this.initDate(time)
				this.searchObj['ym'] = `${time[0]}-${time[1]}`
				this.search()	
			},
			search() {
				let search = {
					...this.searchObj
				}
				this._getSingleMissionList(search)
			},
			pageChange(page) {
				this.search(page)
			},
			_getSingleMissionList(search) {
				this.showLoading = true
				getSingleMissionList(search).then(res => {
					if(res.code === ERR_OK) {
						this.dataList = res.result.result
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
	.single-mission {
		width: 100%;
		background-color: white;
		.single-mission-warpper {
			width: 100%;
			background-color: white;
			.head {
				width: 100%;
				font-size: 14px;
				.searchBtn {
					margin-left: 10px;
				}
			}
			.table {
				width: 100%;
				margin-top: 10px;
			}
			.page {
				margin-top: 20px;
			}
			.calendar {
				width: 666px;
				margin: 0 auto;
				position: relative;
				.calendar-cascader {
					width: 200px;
					margin-bottom: 20px;
				}
				.calendar-status {
					position: absolute;
					top: 10px;
					right: 20px;
					.calendar-statusLists {
						.calendar-statusList {
							font-size: 12px;
							margin: 0 8px;
							display: flex;
							align-items: center;
							justify-content: center;
							.status {
								width: 6px;
								height: 6px;
								background-color: #42F342;
								border-radius: 3px;
								margin-right: 5px;
							}
							.status-success {
								background-color: #42F342;
							}
							.status-error {
								background-color: red;
							}
							.status-title {
								flex: 0 0 1;
							}
						}
					}
				}
				.calendar-header-lists {
					border-top: 1px solid rgb(207, 223, 235);
					border-left: 1px solid rgb(207, 223, 235);
				}
				.calendar-content-lists {
					border-left: 1px solid rgb(207, 223, 235);
				}
				.calendar-list {
					width: 95px;
					height: 95px;
					font-weight: 700;
					background-color: white;
					border-right: 1px solid rgb(207, 223, 235);
					border-bottom: 1px solid rgb(207, 223, 235);
				}
				.calendar-headList {
					height: 30px;
					line-height: 30px;
					text-align: center;
				}
				.calendar-haveList {
					height: 95px;
					cursor: pointer;
					text-align: center;
					transition: all .2s;
					position: relative;
					background-color: rgba(238, 238, 238, 0.3);
					.date {
						width: 30px;
						height: 100%;
						line-height: 94px;
						position: absolute;
						top: 0;
						left: 0;
						font-size: 20px;
					}
					.date-warpper {
						padding: 30px 0;
						position: absolute;
						top: 0px;
						bottom: 0;
						left: 30px;
						right: 0;
						font-size: 20px;
						.calendar-person {
							font-size: 12px;
							.calendar-personInfo {
								display: flex;
								align-items: center;
								justify-content: center;
								.calendar-personName {
									flex: 1;
								}
								.calendar-personStatus {
									width: 6px;
									height: 6px;
									border-radius: 3px;
									margin-right: 5px;
								}
								.calendar-personStatus-success {
									background-color: #42F342;
								}
								.calendar-personStatus-error {
									background-color: red;
								}
							}
							
							
						}
					}
					.canlendar-border {
						display: none;
						border: 3px solid @color-default;
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
					}
				}
				.today-active {
					background-color: @color-default;
					color: white;
					.canlendar-border {
						display: block;
					}
				}
				.calendar-haveList:hover {
					box-shadow: 1px 1px 10px 0 @color-default;
					transform: translateX(-2px) translateY(-2px);
					.canlendar-border {
						display: block;
					}
				}
			}
		}
		
		.more-model {
			width: 900px;
			height: 600px;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			.table {
				width: 100%;
				height: 100%;
				padding: 5px;
				overflow: auto;
				.table-warpper {
					width: 100%;
				}
			}
		}
	}
</style>