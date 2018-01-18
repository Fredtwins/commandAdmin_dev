<template>
	<div class="single-danger">
		<div class="single-danger-warpper">
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
	import { interactModelMixin, loadingMixin } from 'common/js/mixins'
	import { dangerManagementThead } from 'common/js/table'
	import { errorNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getMissionList } from 'api/danger-management'
	
	export default {
		mixins: [interactModelMixin, loadingMixin],
		components: {
			'patrol-mission-expand': patrolMissionExpand
		},
		props: {
			name: {
				type: String,
				default: ''
			}
		},
		created() {
			this.search(1)
		},
		data() {
			return {
				rowIng: null,
				tableThead: dangerManagementThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				showLoading: false
			}
		},
		methods: {
			show(row) {
				this.rowIng = row
				this.$refs['more-model'].showModel()
			},
			search(page) {
				let search = {
					'construction.constructionid': this.name
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
	.single-danger {
		width: 100%;
		.single-danger-warpper {
			width: 100%;
			padding: 10px;
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