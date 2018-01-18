<template>
	<div class="notice-management">
		<div class="notice-management-warpper">
			<div class="title">
				<base-title title="通知公告管理"></base-title>
			</div>
			<div class="head clear">
				<div class="search pull-left">
					<span>公告标题</span>
					<Input v-model="searchValue['notice_title']" placeholder="公告标题" @on-enter="search(1)" style="width: 200px;padding-left: 10px;"></Input>
					&nbsp;&nbsp;
					<span>时间</span>
					<DatePicker 
						v-model="searchValue['start_time']" 
						type="datetime" 
						placeholder="开始创建时间" 
						style="width: 200px;padding-left: 10px;"></DatePicker>
					-
					<DatePicker 
						v-model="searchValue['end_time']" 
						type="datetime" 
						placeholder="结束创建时间" 
						style="width: 200px"></DatePicker>
				</div>
				<div class="searchBtn pull-left" @click="search(1)">
					<Button type="ghost" shape="circle" icon="ios-search"></Button>
				</div>
				<div class="add pull-right" @click="add">
					<Button type="primary">新增公告</Button>
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
		
		<warn-model 
			title="警告" 
			message="确定要删除这条记录？" 
			ref="del-warnModel"
			@sure="removeCommit"></warn-model>
		
		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { dateTimeFormat } from 'common/js/config'
	import { baseTitleMixin, loadingMixin, warnModelMixin } from 'common/js/mixins'
	import { noticeManagementThead } from 'common/js/table'
	import { likeStrSearch, gtStrSearch, ltStrSearch, betweenStrSearch , timeFilter, cloneObj } from 'common/js/util'
	import { errorNotice, successNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getNoticeList, updateNoticeList } from 'api/notice-management'
	
	export default {
		mixins: [baseTitleMixin, loadingMixin, warnModelMixin],
		created() {
			this.rowIng = {}
			this._getNoticeList()
		},
		data() {
			return {
				searchValue: {
					notice_title: '',
					start_time: '',
					end_time: ''
				},
				tableThead: noticeManagementThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				showLoading: false
			}
		},
		methods: {
			add() {
				this.$router.push('/home/noticeSingle/add')
			},
			edit(row) {
				this.$router.push(`/home/noticeSingle/edit_${row.noticeid}`)
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
				
				updateNoticeList(type, data).then(res => {
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
				
				if(this.searchValue.notice_title) {
					search.notice_title = likeStrSearch(this.searchValue.notice_title)
				}
				
				if(this.searchValue.start_time && !this.searchValue.end_time) {
					let time = timeFilter(this.searchValue.start_time, dateTimeFormat)
					search.create_time = gtStrSearch(time)
				}else if(!this.searchValue.start_time && this.searchValue.end_time) {
					let time = timeFilter(this.searchValue.end_time, dateTimeFormat)
					search.create_time = ltStrSearch(time)
				}else if(this.searchValue.start_time && this.searchValue.end_time) {
					let start_time = timeFilter(this.searchValue.start_time, dateTimeFormat)
					let end_time = timeFilter(this.searchValue.end_time, dateTimeFormat)
					search.create_time = betweenStrSearch(start_time, end_time)
				}
				
				this._getNoticeList(page, search)
			},
			pageChange(page) {
				this.search(page)
			},
			_getNoticeList(page, search) {
				this.showLoading = true
				getNoticeList(page, search).then(res => {
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

	.notice-management {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.notice-management-warpper {
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