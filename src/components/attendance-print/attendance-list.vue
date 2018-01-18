<template>
	<div class="attendance-list">
		<div class="attendance-list-warpper" v-if="rowIng">
			<div class="list-content">
				<table 
					class="list-content-table" 
					border="1" 
					v-for="items in rowIng">
					<tr class="list-content-tr">
						<th>工地片区</th>
						<th>所属工地</th>
						<th>用户姓名</th>
						<th>手机号码</th>
						<th>职位/属性</th>
						<th>打卡时间</th>
						<th>打卡状态</th>
						<th>注册时图片</th>
						<th>当前上传图片</th>
					</tr>
					<tr v-for="item in items" class="list-content-tr">
						<td>{{item.construction.area}}</td>
						<td class="list-content-construction">{{item.construction.name}}</td>
						<td>{{item.user.realname}}</td>
						<td>{{item.user.username}}</td>
						<td>{{`${item.user.role}/${item.user.job}`}}</td>
						<td>{{item.date_time}}</td>
						<td>{{item.state}}</td>
						<td>
							<img :src="`${httpUrl}${item.user.facepic}`" width="100" alt="" />
						</td>
						<td>
							<img :src="`${httpUrl}${item.pic}`" width="100" alt="" />
						</td>
					</tr>
				</table>
			</div>
			
			<div class="list-print pull-right" @click="print">
				<Button type="primary">打印</Button>
			</div>
		</div>
		
		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { loadingMixin } from 'common/js/mixins'
	import { errorNotice } from 'common/js/dom'
	import { split_array } from 'common/js/util'
	import { httpUrl, ERR_OK } from 'api/config'
	import { getAttendanceExportList } from 'api/attendance'
	
	export default {
		mixins: [loadingMixin],
		created() {
			this._getAttendanceExportList()
		},
		data() {
			return {
				rowIng: null,
				httpUrl: httpUrl,
				showLoading: false
			}
		},
		methods: {
			print() {
				window.print()
			},
			_getAttendanceExportList() {
				this.showLoading = true

				let month = this.$route.params.name

				getAttendanceExportList(month).then(res => {
					if(res.code === ERR_OK) {
						if(res.result.result.length) {
							this.rowIng = split_array(res.result.result, 6)
							document.getElementsByTagName('html')[0].style.overflow = 'auto'
							document.getElementsByTagName('html')[0].style.height = 'auto'
						} else {
							this.$router.push('/home/attendanceManagement')
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
	.attendance-list {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: auto;
		.attendance-list-warpper {
			width: 1000px;
			font-size: 14px;
			margin: auto;
			.list-content {
				width: 100%;
				.list-content-table {
					width: 100%;
					margin-bottom: 20px;
					.list-content-tr {
						th, td {
							padding: 5px;
							text-align: center;
							white-space: nowrap;
						}
						.list-content-construction {
							text-align: left;
							white-space: normal;
						}
					}
				}
			}
			.list-print {
				margin-top: 20px;
			}
		}
	}
	
	@media print {
		.list-print {
			display: none;
			opacity: 0
		}
	}
</style>