<template>
	<div class="patrol-missionHistory">
		<div class="patrol-missionHistory-warpper clear">
			<div class="title">
				<base-title title="历史巡查管理"></base-title>
			</div>
			<div class="head clear">
				<div class="search pull-left">
					<span>工地片区</span>
					<Select 
						v-model="searchValue.area"
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
						v-model="searchValue.name" 
						placeholder="工地名称" 
						@on-enter="search(1)"
						style="width: 200px;padding-left: 10px;"></Input>
					&nbsp;&nbsp;
					<span>年月份</span>
					<DatePicker 
						v-model="searchValue.ym" 
						type="month" 
						placeholder="年月份" 
						style="width: 200px"
						:clearable="false"
						@on-change="dateChange"></DatePicker>
				</div>
				<div class="searchBtn pull-left" @click="search(1)">
					<Button 
						type="ghost" 
						shape="circle" 
						icon="ios-search"></Button>
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
					show-elevator
					@on-change="pageChange"></Page>
			</div>
			<loading v-show="showLoading"></loading>
		</div>
	</div>
</template>

<script>
	import { baseTitleMixin, loadingMixin } from 'common/js/mixins'
	import { patrolHistoryThead } from 'common/js/table'
	import { timeFilter, setTaksIng } from 'common/js/util'
	import { monthFormat } from 'common/js/config'
	import { errorNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getMissionHistoryList } from 'api/patrol-mission-history'

	export default {
		mixins: [baseTitleMixin, loadingMixin],
		created() {
			this._getMissionHistoryList()
			
			this.searchValue.ym = [new Date().getFullYear(), new Date().getMonth() + 1]
		},
		data() {
			return {
				searchValue: {
					name: '',
					area: '',
					ym: []
				},
				tableThead: patrolHistoryThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				showLoading: false
			}
		},
		methods: {
			goDetail(row) {
				setTaksIng(row)
				this.$router.push(`/home/patrolMission/${row.constructionid}`)
			},
			dateChange(time) {
				this.searchValue.ym = time.split()
			},
			search(page) {
				let search = {}
				for(let key in this.searchValue) {
					if (this.searchValue[key]) {
						if (key === 'ym') {
							search[key] = this.searchValue[key].join('-')
						}else {
							search[key] = this.searchValue[key]							
						}
					}
				}
				this._getMissionHistoryList(page, search)
			},
			pageChange(page) {
				this.search(page)
			},
			_getMissionHistoryList(page, search) {
				this.showLoading = true
				getMissionHistoryList(page, search).then(res => {
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
	
	.patrol-missionHistory {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.patrol-missionHistory-warpper {
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
	}
</style>