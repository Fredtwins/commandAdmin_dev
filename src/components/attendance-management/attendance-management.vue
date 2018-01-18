<template>
	<div class="attendance-management">
		<div class="attendance-management-warpper clear">
			<div class="title">
				<base-title title="考勤记录管理"></base-title>
			</div>
			<div class="head clear">
				<div class="search pull-left">
					<span>工地片区</span>
					<Select 
						v-model="searchValue['construction.area']"
						placeholder="工地片区"
						:clearable="true"
						style="width:150px;padding-left: 10px;">
				        <Option value="东片区" key="东片区">东片区</Option>
				        <Option value="中片区" key="中片区">中片区</Option>
				        <Option value="西片区" key="西片区">西片区</Option>
				   	</Select>
					&nbsp;&nbsp;
					<span>工地名称</span>
					<Input 
						v-model="searchValue['construction.name']"
						placeholder="工地名称" 
						@on-enter="search"
						style="width: 150px;padding-left: 10px;"></Input>
					&nbsp;&nbsp;
					<span>年月份</span>
					<DatePicker 
						type="month" 
						placeholder="年月份" 
						style="width: 150px"
						@on-change="dateChange"></DatePicker>
					&nbsp;&nbsp;
					<span>打卡状态</span>
					<Select 
						v-model="searchValue['state']"
						placeholder="打卡状态"
						:clearable="true"
						style="width:150px;padding-left: 10px;">
				        <Option value="成功" key="成功">成功</Option>
				        <Option value="失败" key="失败">失败</Option>
				   	</Select>
				</div>
				<div class="searchBtn pull-left" @click="search">
					<Button 
						type="ghost" 
						shape="circle" 
						icon="ios-search"></Button>
				</div>
				<div class="exportBtn pull-right" @click="exportDataClick">
					<Button type="primary">打印</Button>
				</div>
			</div>
			<div class="table">
				<Table 
					ref="table"
					border 
					stripe
					highlight-row
					size="small" 
					:columns="tableThead" 
					:data="tableTbody"></Table>
			</div>
			<div class="page pull-right">
				<Page 
					:total="total" 
					:current="current"
					show-elevator
					@on-change="pageChange"></Page>
			</div>
			<loading v-show="showLoading"></loading>
		</div>
		
		<transition name="fade">
			<div class="audit-show" v-show="isAudit">
				<div class="audit-show-warpper" @click="hideAudit">
					<div class="audit-close" @click.stop="hideAudit">
						<Icon type="close"></Icon>
					</div>
					<div class="audit-content">
						<div class="audit-content-box">
							<div class="audit-content-ing">
								<div class="audit-content-title">注册时图片</div>
								<img :src="imgIng" @click.stop />
							</div>
							<div class="audit-content-hr"></div>
							<div class="audit-content-will">
								<div class="audit-content-title">当前上传图片</div>
								<img :src="imgWill" @click.stop />
							</div>
						</div>
						<div class="audti-show-action clear" v-show="isShowAudit">
							<div class="audit-show-ok pull-left" @click.stop="successAudit">
								<Icon type="checkmark-round"></Icon>
							</div>
							<div class="audit-show-no pull-left" @click.stop="hideAudit">
								<Icon type="close-round"></Icon>
							</div>
						</div>
					</div>
				</div>
			</div>
		</transition>
		
		<primary-model ref="export-model" title="请选择导出月份" @sure="exportDataSure">
			<div class="export-time">
				<Cascader 
					style="width: 200px;margin: 0 auto;"
					:data="monthData" 
					:clearable="false"
					v-model="exportDates"></Cascader>				
			</div>
		</primary-model>
		
		<interact-model ref="map-model" class="map-model" title="位置">
			<div class="map-warpper" v-if="isShowMap">
				<attendance-map ref="map-warpper"></attendance-map>
			</div>
		</interact-model>
	</div>
</template>

<script>
	import attendanceMap from 'base/attendance-map/attendance-map'
	import { baseTitleMixin, loadingMixin, interactModelMixin, primaryModelMixin } from 'common/js/mixins'
	import { calendarData } from 'common/js/module'
	import { attendanceThead } from 'common/js/table'
	import { successNotice, errorNotice } from 'common/js/dom'
	import { httpUrl, ERR_OK } from 'api/config'
	import { getAttendanceList, getAttendanceExportList, updateAttendanceState } from 'api/attendance'

	export default {
		mixins: [baseTitleMixin, loadingMixin, interactModelMixin, primaryModelMixin],
		components:  {
			'attendance-map': attendanceMap
		},
		created() {
			this.page = 1
			
			this.rowIng = {}
			
			let time = new Date()
			let year = time.getFullYear()
			let month = time.getMonth() < 10 ? `0${time.getMonth()}` : time.getMonth()
			this.exportDates = [year, month]
			
			this._getAttendanceList()
		},
		data() {
			return {
				searchValue: {
					'construction.name': '',
					'construction.area': '',
					'ym': '',
					'state': ''
				},
				tableThead: attendanceThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				monthData: calendarData,
				exportDates: [],
				showLoading: false,
				isShowMap: false,
				isAudit: false,
				isShowAudit: false,
				imgIng: '',
				imgWill: ''
			}
		},
		methods: {
			exportDataClick() {
				if (this.isShowMap) {
					this.$refs['map-model'].hideModel()
				}
				this.$refs['export-model'].showModel()
			},
			exportDataSure() {
				let month = `${this.exportDates[0]}-${this.exportDates[1]}`
				
				window.open(`${location.origin}${location.pathname}#/attendanceList/${month}`, '_blank')
				
				this.$refs['export-model'].hideModel()
			},
			successAudit() {
				this.showLoading = true
				updateAttendanceState(this.rowIng.checkid).then(res => {
					if (res.code === ERR_OK) {
						this.search()
						this.hideAudit()
						successNotice('操作成功')
					}else {
						errorNotice('操作失败')
					}
					this.showLoading = false
				})
			},
			hideAudit() {
				this.isAudit = false
			},
			audit(row) {
				if (this.isShowMap) {
					this.$refs['map-model'].hideModel()
				}
				this.isShowAudit = true
				this.rowIng = row
				this.isAudit = true
				this.imgIng = `${httpUrl}${row.user.facepic}`
				this.imgWill = `${httpUrl}${row.pic}`
			},
			showAudit(row) {
				if (this.isShowMap) {
					this.$refs['map-model'].hideModel()
				}
				this.isShowAudit = false
				this.rowIng = row
				this.isAudit = true
				this.imgIng = `${httpUrl}${row.user.facepic}`
				this.imgWill = `${httpUrl}${row.pic}`
			},
			showMap(row) {
				this.$refs['map-model'].showModel()
				this.isShowMap = true
				setTimeout(() => {
					this.$refs['map-warpper'].setMap(row)						
				}, 20)
			},
			dateChange(time) {
				this.searchValue.ym = time
			},
			search() {
				let search = {}
				for(let key in this.searchValue) {
					if (this.searchValue[key]) {
						search[key] = this.searchValue[key]
					}
				}
				this._getAttendanceList(search)
			},
			pageChange(page) {
				this.page = page
				this.search()
			},
			_getAttendanceList(search) {
				this.showLoading = true
				getAttendanceList(this.page, search).then(res => {
					if (res.code === ERR_OK) {
						this.tableTbody = res.result.result
						this.total = res.result.totalSize
						this.current = res.result.page
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
	@import url('~common/less/animate');
	
	.attendance-management {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.attendance-management-warpper {
			width: 100%;
			min-height: 100%;
			padding: 10px;
			position: relative;
			background-color: white;
			.title {
				padding: 10px 0 20px;
			}
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
		}
		.audit-show {
			z-index: 100;
			position: fixed;
			background-color: rgba(0, 0, 0, 0.8);
			top: 0;
			bottom: 0;
			left: 200px;
			right: 0;
			.audit-show-warpper {
				width: 100%;
				height: 100%;
				.audit-close {
					width: 20px;
					height: 26px;
					color: #7E7B7B;
					font-size: 26px;
					cursor: pointer;
					position: absolute;
					top: 50px;
					right: 50px;
				}
				.audit-close:hover {
					color: white;
				}
				.audit-content {
					width: 100%;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					.audit-content-box {
						width: 100%;
						display: flex;
						align-content: center;
						justify-content: center;
						.audit-content-ing, .audit-content-will {
							.audit-content-title {
								text-align: center;
								color: white;
								font-size: 18px;
							}
						}
						.audit-content-hr {
							border-left: 1px solid white;
							margin: 0 20px;
						}
					}
				}
				.audti-show-action {
					width: 150px;
					margin-left: 50%;
					transform: translateX(-50%);
					margin-top: 20px;
					.audit-show-ok {
						width: 60px;
						height: 60px;
						text-align: center;
						line-height: 57px;
						border-radius: 30px;
						border: 3px solid rgba(128, 128, 128, 0.4);
						color: rgba(128, 128, 128, 0.4);
						font-size: 40px;
						cursor: pointer;
						margin-right: 30px;
					}
					.audit-show-ok:hover {
						color: #19be6b;
						border: 3px solid #19be6b;
					}
					.audit-show-no {
						width: 60px;
						height: 60px;
						text-align: center;
						line-height: 57px;
						border-radius: 30px;
						border: 3px solid rgba(128, 128, 128, 0.4);
						color: rgba(128, 128, 128, 0.4);
						font-size: 40px;
						cursor: pointer;
					}
					.audit-show-no:hover {
						color: #ed3f14;
						border: 3px solid #ed3f14;
					}
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