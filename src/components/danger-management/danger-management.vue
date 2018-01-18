<template>
	<div class="task-management">
		<div class="task-management-warpper clear">
			<div class="title">
				<base-title title="隐患管理"></base-title>
			</div>
			<div class="head clear">
				<div class="search pull-left">
					<span>工地片区</span>
					<Select 
						v-model="searchValue['construction.area']"
						placeholder="工地片区"
						:clearable="true"
						style="width:200px;padding-left: 10px;">
				        <Option value="东片区" key="东片区">东片区</Option>
				        <Option value="中片区" key="中片区">中片区</Option>
				        <Option value="西片区" key="西片区">西片区</Option>
				   	</Select>
					&nbsp;&nbsp;
					<span>工地名称</span>
					<Input 
						v-model="searchValue['construction.name']" 
						placeholder="工地名称" 
						@on-enter="search(1)" 
						style="width: 200px;padding-left: 10px;"></Input>
					&nbsp;&nbsp;
					<span>年月份</span>
					<DatePicker 
						type="month" 
						placeholder="年月份" 
						style="width: 200px"
						@on-change="dateChange"></DatePicker>
				</div>
				<div class="searchBtn pull-left" @click="search(1)">
					<Button type="ghost" shape="circle" icon="ios-search"></Button>
				</div>
			</div>
			<div class="table">
				<Table 
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
					@on-change="pageChange"
					show-elevator></Page>
			</div>
		</div>
		
		<interact-model
			ref="more-model" 
			class="more-model" 
			title="隐患详情">
			<div class="expand-warpper" v-if="rowIng">
				<patrol-mission-expand :row="rowIng"></patrol-mission-expand>				
			</div>
		</interact-model>
		
		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import patrolMissionExpand from 'base/patrol-mission-expand/patrol-mission-expand'
	import { baseTitleMixin, interactModelMixin, loadingMixin } from 'common/js/mixins'
	import { dangerManagementThead } from 'common/js/table'
	import { errorNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getMissionList } from 'api/danger-management'

	export default {
		mixins: [baseTitleMixin, interactModelMixin, loadingMixin],
		components: {
			'patrol-mission-expand': patrolMissionExpand
		},
		created() {
			this._getMissionList()
		},
		data() {
			return {
				rowIng: null,
				searchValue: {
					'construction.name': '',
					'construction.area': ''
				},
				tableThead: dangerManagementThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				showLoading: false
			}
		},
		methods: {
			dateChange(time) {
				this.searchValue.ym = time
			},
			show(row) {
				this.rowIng = row
				this.$refs['more-model'].showModel()
			},
			search(page) {
				let search = {}
				for(let key in this.searchValue) {
					if (this.searchValue[key]) {
						search[key] = this.searchValue[key]
					}
				}
				this._getMissionList(page, search)
			},
			pageChange(page) {
				this.search(page)
			},
			_getMissionList(page, search) {
				this.showLoading = true
				getMissionList(page, search).then(res => {
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

	.task-management {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.task-management-warpper {
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
		
		.more-model {
			width: 600px;
			height: 400px;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			.expand-warpper {
				width: 100%;
				height: 100%;
				padding: 5px;
				font-size: 12px;
				overflow: auto;
			}
		}
	}
</style>