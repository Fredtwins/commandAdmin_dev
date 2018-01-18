<template>
	<div class="task-management">
		<div class="task-management-warpper clear">
			<div class="title">
				<base-title title="工地管理"></base-title>
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
					<span>工地状态</span>
					<Select 
						v-model="searchValue.state"
						placeholder="工地状态"
						:clearable="true"
						style="width:200px;padding-left: 10px;">
				        <Option value="已建" key="已建">已建</Option>
				        <Option value="在建" key="在建">在建</Option>
				        <Option value="规划中" key="规划中">规划中</Option>
				   	</Select>
					&nbsp;&nbsp;
					<span>工地名称</span>
					<Input v-model="searchValue.name" placeholder="工地名称" @on-enter="search(1)" style="width: 200px;padding-left: 10px;"></Input>
				</div>
				<div class="searchBtn pull-left" @click="search(1)">
					<Button type="ghost" shape="circle" icon="ios-search"></Button>
				</div>
				<div class="action pull-right" @click="add">
					<Button type="primary">新增工地</Button>
				</div>
			</div>
			<div class="table">
				<Table 
					border 
					stripe 
					highlight-row 
					size="small" 
					:columns="tableThead" 
					:data="tableTbody"
					@on-row-click="goDetail"></Table>
			</div>
			<div class="page pull-right">
				<Page :total="total" :current="current" show-elevator @on-change="pageChange"></Page>
			</div>
			<loading v-show="showLoading"></loading>
		</div>
		
		<warn-model 
			title="警告" 
			message="确定要删除这条记录？" 
			ref="del-warnModel"
			@sure="removeCommit"></warn-model>

	</div>
</template>

<script>
	import { baseTitleMixin, loadingMixin, warnModelMixin } from 'common/js/mixins'
	import { taskManagementThead } from 'common/js/table'
	import { cloneObj , setTaksIng } from 'common/js/util'
	import { errorNotice, successNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getTaskList, updateTaskList } from 'api/task-management'

	export default {
		mixins: [baseTitleMixin, loadingMixin, warnModelMixin],
		created() {
			this._getTaskList()
			this.rowIng = {}
		},
		data() {
			return {
				searchValue: {
					area: '',
					state: '',
					name: ''
				},
				tableThead: taskManagementThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				showLoading: false
			}
		},
		methods: {
			goDetail(row) {
				setTaksIng(row)
				this.$router.push(`/home/taskSingle/${row.constructionid}`)
			},
			add() {
				this.$router.push('/home/taskAction/add')
			},
			edit(row) {
				this.$router.push(`/home/taskAction/edit_${row.constructionid}`)
			},
			remove(row) {
				this.rowIng = cloneObj(row)
				this.$refs['del-warnModel'].showModel()
			},
			removeCommit() {
				this.showLoading = true
				this.$refs['del-warnModel'].hideModel()
				let type = 'del'
				let data = {
					_ids: this.rowIng._id
				}
				
				updateTaskList(type, data).then(res => {
					if (res.code === ERR_OK) {
						this.search(1)
						successNotice('操作成功')
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			search(page) {
				let search = {}
				for(let key in this.searchValue) {
					if (this.searchValue[key]) {
						search[key] = this.searchValue[key]
					}
				}
				this._getTaskList(page, search)
			},
			pageChange(page) {
				this.search(page)
			},
			_getTaskList(page, search) {
				this.showLoading = true
				getTaskList(page, search).then(res => {
					if(res.code === ERR_OK) {
						this.tableTbody = res.result.result
						this.total = res.result.totalSize
						this.current = res.result.page
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
	}
</style>