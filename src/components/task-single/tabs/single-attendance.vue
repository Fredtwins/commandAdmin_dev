<template>
	<div class="single-attendance">
		<div class="single-attendance-warpper clear">
			<div class="calendar pull-left" ref="calendar">
				<div class="calendar-warpper">
					<div class="calendar-cascader">
						<Cascader :data="data" v-model="cascaderData" @on-change="cascaderChange" :clearable="false"></Cascader>
					</div>
					<div class="calendar-status">
						<ul class="calendar-statusLists">
							<li class="calendar-statusList">
								<div class="status"></div>
								<div class="status-title">已打卡</div>
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
							<li class="calendar-list pull-left" :class="{
									'calendar-haveList': item.index, 
									'today-active': monthActive && getDate() === item.index
								}" v-for="item in dateData" @click="calendarClick(item)">
								<div class="date">{{item.index}}</div>
								<div class="date-warpper">
									<div v-for="info in item.data" class="calendar-person">
										<div class="calendar-personStatus"></div>
										<div class="calendar-personName">{{info.user.realname}}</div>
									</div>
								</div>
								<div class="canlendar-border" v-if="item.index"></div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		
			<div class="attendance-statistics pull-left">
				<div class="attendance-statistics-warpper">
					<div class="attendance-status clear">
						<div class="attendance-statusBox pull-right">
							<div class="status"></div>
							<div class="status-title">考勤满足</div>							
						</div>
					</div>
					<table class="attendance-table" border>
						<thead class="attendance-thead">
							<tr>
								<td>考勤人姓名</td>
								<td>考勤次数</td>
							</tr>
						</thead>
						<tbody class="attendance-tbody">
							<tr v-for="(item, key) in filterCount"
								:class="{'attendance-success': item >= 22}">
								<td>{{key}}</td>
								<td>{{item}}</td>
							</tr>
							<tr v-show="havefilterCount">
								<td colspan="2">暂无考勤记录</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<interact-model ref="more-model" class="more-model" :title="moreTitle">
			<div class="table">
				<div class="table-warpper">
					<Table border highlight-row size="small" :columns="tableThead" :data="tableTbody"></Table>
				</div>
			</div>
		</interact-model>
		
		<interact-model ref="map-model" class="map-model" title="位置">
			<div class="map-warpper" v-if="isShowMap">
				<attendance-map ref="map-warpper"></attendance-map>
			</div>
		</interact-model>

		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import attendanceMap from 'base/attendance-map/attendance-map'
	import { loadingMixin, interactModelMixin, calendarMixin } from 'common/js/mixins'
	import { attendanceThead } from 'common/js/table'
	import { errorNotice } from 'common/js/dom'
	import { isNullObject } from 'common/js/util'
	import { ERR_OK } from 'api/config'
	import { getSingleAttendanceList } from 'api/attendance'

	export default {
		mixins: [loadingMixin, interactModelMixin, calendarMixin],
		components:  {
			'attendance-map': attendanceMap
		},
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
					if(item.state === '成功') {
						if(obj[item.ymd] === undefined) {
							obj[item.ymd] = [item]
						} else {
							obj[item.ymd].push(item)
						}
					}
				})
				return obj
			},
			filterCount() {
				let obj = {}
				for(let key in this.filterList) {
					this.filterList[key].map(item => {
						let str = item.user.realname
						if(item.state === '成功') {
							if(obj[str] === undefined) {
								obj[str] = 1
							} else {
								obj[str] = ++obj[str]
							}
						}
					})
				}
				return obj
			},
			havefilterCount() {
				return isNullObject(this.filterCount)
			}
		},
		created() {
			this.searchObj['construction.constructionid'] = this.name
			this.searchObj['ym'] = `${this.cascaderData[0]}-${this.cascaderData[1]}`
		},
		mounted() {
			this.search()
		},
		data() {
			return {
				searchObj: {},
				moreTitle: '',
				tableThead: attendanceThead(this, false),
				tableTbody: [],
				showLoading: false,
				isShowMap: false
			}
		},
		methods: {
			showMap(row) {
				this.$refs['map-model'].showModel()
				this.isShowMap = true
				setTimeout(() => {	
					this.$refs['map-warpper'].setMap(row)
				}, 20)
			},
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
			search(page) {
				let search = {
					...this.searchObj
				}
				this._getSingleAttendanceList(search)
			},
			_getSingleAttendanceList(search) {
				this.showLoading = true
				getSingleAttendanceList(search).then(res => {
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
	.single-attendance {
		width: 100%;
		.single-attendance-warpper {
			width: 877px;
			margin: 0 auto;
			.calendar {
				width: 666px;
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
					background-color: rgb(236, 242, 246);
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
						padding: 10px 0;
						position: absolute;
						top: 0px;
						bottom: 0;
						left: 30px;
						right: 0;
						font-size: 20px;
						.calendar-person {
							font-size: 12px;
							display: flex;
							align-items: center;
							justify-content: center;
							.calendar-personStatus {
								width: 6px;
								height: 6px;
								background-color: #42F342;
								border-radius: 3px;
								margin-right: 5px;
							}
							
							.calendar-personName {
								flex: 1;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
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
			.attendance-statistics {
				margin-left: 20px;
				padding-top: 10px;
				.attendance-statistics-warpper {
					.attendance-statusBox {
						margin-bottom: 24px;
						font-size: 12px;
						display: flex;
						align-items: center;
						.status {
							width: 6px;
							height: 6px;
							background-color: #19be6b;
							border-radius: 3px;
							margin-right: 5px;
						}
						.status-title {
							flex: 0 0 1;
						}
					}
					.attendance-table {
						border: 1px solid #cfdfeb;
						.attendance-thead {
							tr {
								td {
									width: 95px;
									height: 30px;
									text-align: center;
									background-color: #ecf2f6;
								}
							}
						}
						.attendance-tbody {
							tr {
								td {
									width: 95px;
									height: 30px;
									text-align: center;
									background-color: rgba(238, 238, 238, 0.3);
									font-size: 14px;
								}
							}
							.attendance-success {
								color: #19be6b;
							}
						}
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
		.map-model {
			width: 480px;
			height: 350px;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			.map-warpper {
				width: 100%;
				height: 100%;
				overflow: hidden;
				padding: 10px;
				
			}
		}
	}
</style>