<template>
	<div class="patrol-mission">
		<div class="patrol-mission-warpper clear">
			<div class="title">
				<base-title title="巡查任务管理"></base-title>
			</div>
			<div class="bread-menu">
				<Breadcrumb>
			        <BreadcrumbItem href="/home/patrolMissionHistory">历史巡查管理</BreadcrumbItem>
			        <BreadcrumbItem>{{getTaskIng.name}}</BreadcrumbItem>
			    </Breadcrumb>
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
	import { patrolMissionThead } from 'common/js/table'
	import { errorNotice } from 'common/js/dom'
	import { getTaksIng } from 'common/js/util'
	import { ERR_OK } from 'api/config'
	import { getMissionList } from 'api/patrol-mission'

	export default {
		mixins: [baseTitleMixin, loadingMixin],
		computed: {
			getTaskIng() {
				return getTaksIng()
			}
		},
		created() {
			this.name = this.$route.params.name	

			this.ifTrueInfo()

			this.search(1)
		},
		data() {
			return {
				searchValue: '',
				tableThead: patrolMissionThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				showLoading: false
			}
		},
		methods: {
			search(page) {
				let search = {
					'construction.constructionid': this.name
				}
				this._getMissionList(page, search)
			},
			pageChange(page) {
				this.search(page)
			},
			ifTrueInfo() {
				if (this.name === this.getTaskIng.constructionid) {
					return 
				}
				this.$router.push('/home/patrolMissionHistory')
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
	
	.patrol-mission {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.patrol-mission-warpper {
			width: 100%;
			min-height: 100%;
			padding: 10px;
			position: relative;
			background-color: white;
			.title {
				padding: 10px 0 20px;
			}
			.table {
				width: 100%;
				margin-top: 20px;
			}
			.page {
				margin-top: 20px;
			}
		}
	}
</style>