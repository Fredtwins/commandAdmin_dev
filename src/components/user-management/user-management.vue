<template>
	<div class="user-management">
		<div class="user-management-warpper clear" >
			<div class="title">
				<base-title title="用户管理"></base-title>
			</div>
			<div class="head clear">
				<div class="search pull-left">
					<span>真实姓名</span>
					<Input 
						v-model="searchValue.realname" 
						placeholder="真实姓名" 
						@on-enter="search(1)"
						style="width: 100px;padding-left: 10px;"></Input>
					&nbsp;&nbsp;
					<span>手机号码</span>
					<Input 
						v-model="searchValue.username" 
						placeholder="手机号码" 
						@on-enter="search(1)"
						style="width: 100px;padding-left: 10px;"></Input>
					&nbsp;&nbsp;
					<span>所在单位</span>
					<Input 
						v-model="searchValue.institution" 
						placeholder="所在单位" 
						@on-enter="search(1)"
						style="width: 100px;padding-left: 10px;"></Input>
					&nbsp;&nbsp;
					<span>审核状态</span>
					<Select 
						v-model="searchValue.audit_status"
						placeholder="审核状态"
						:clearable="true"
						style="width:100px;padding-left: 10px;">
				        <Option value="通过" key="通过">通过</Option>
				        <Option value="未通过" key="未通过">未通过</Option>
				        <Option value="未审核" key="未审核">未审核</Option>
				        <Option value="未注册" key="未注册">未注册</Option>
				   </Select>
				   &nbsp;&nbsp;
					<span>用户职位</span>
					<Select 
						v-model="searchValue.role"
						placeholder="用户职位"
						:clearable="true"
						style="width:100px;padding-left: 10px;">
				        <Option value="管理员" key="管理员">管理员</Option>
				        <Option value="巡查员" key="巡查员">巡查员</Option>
				        <Option value="施工方" key="施工方">施工方</Option>
				        <Option value="监理方" key="监理方">监理方</Option>
				   </Select>
				</div>
				<div class="searchBtn pull-left" @click="search(1)">
					<Button 
						type="ghost" 
						shape="circle" 
						icon="ios-search"></Button>
				</div>
				<div class="add pull-right" @click="add">
					<Button type="primary">新增用户</Button>
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
					show-elevator
					show-total></Page>
			</div>
		</div>
		<!--可移动拖拽的模态框-->
		<interact-model 
			ref="action-model" 
			class="action-model" 
			:title="actionTitle">
			<div class="action-content">
				<div class="action-warpper">
					<div class="action-formItems">
						<div class="formItems-warpper">
							<user-form :isReadonlyUserNmae="isReadonlyUserNmae" ref="data-form"></user-form>
						</div>
						<div class="formItems-commit" @click="actionCommit">
							<Button type="primary">保存</Button>
						</div>
					</div>
				</div>
			</div>
		</interact-model>
		
		<warn-model 
			title="审核" 
			message="请选择审核状态" 
			ref="audit-warnModel"
			:isAudit="true"
			@sure="auditCommit"></warn-model>
		
		<warn-model 
			title="警告" 
			message="确定要删除该用户？" 
			ref="del-warnModel"
			@sure="removeCommit"></warn-model>
			
		<warn-model 
			title="警告" 
			message="确定要重置该用户密码？" 
			ref="psw-warnModel"
			@sure="resetCommit"></warn-model>
			
		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'
	import userForm from 'base/user-form/user-form'
	import { baseTitleMixin, loadingMixin, interactModelMixin, dataFormMixin, warnModelMixin } from 'common/js/mixins'
	import { userManagementThead } from 'common/js/table'
	import { successNotice, errorNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { cloneObj, likeStrSearch } from 'common/js/util'
	import { getUserList, getOgnList, updateUserList, updateUserAudit, resetUserPsw } from 'api/user-management'
	
	export default {
		mixins: [baseTitleMixin, loadingMixin, interactModelMixin, dataFormMixin, warnModelMixin],
		components: {
			'user-form': userForm
		},
		created() {
			this.rowIng = {}
			this.actionType = ''
			this._getUserList()
			this._getOgnList()
		},
		data() {
			return {
				searchValue: {
					realname: '',
					phone: ''
				},
				tableThead: userManagementThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				isReadonlyUserNmae: false,
				showLoading: false,
				actionTitle: ''
			}
		},
		methods: {
			add() {
				this.actionTitle = '新增用户'
				this.actionType = 'save'
				this.isReadonlyUserNmae = false
				//refs是操作dom元素
				this.$refs['data-form'].initFormItem()
				this.$refs['data-form'].clearValidate()
				this.$refs['action-model'].showModel()
			},
			audit(row) {
				this.rowIng = cloneObj(row)
				this.$refs['audit-warnModel'].showModel()
			},
			auditCommit(str) {
				this.showLoading = true
				this.$refs['audit-warnModel'].hideModel()
				
				let data = {
					userid: this.rowIng.userid,
					audit_status: str
				}
				
				updateUserAudit(data).then(res => {
					if (res.code === ERR_OK) {
						this.search(1)
						successNotice('操作成功')
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			edit(row) {
				this.actionTitle = '编辑用户'
				this.actionType = 'edit'
				this.isReadonlyUserNmae = true
				this.$refs['action-model'].showModel()
				this.$refs['data-form'].clearValidate()
				if (row.job) {
					row.work = [row.role, row.job]					
				}else {
					row.work = [row.role]	
				}
				this.$refs['data-form'].setFormItems(row)
			},
			//保存操作成功、
			actionCommit() {
				if (!this.$refs['data-form'].validate()) {
					return
				}
				
				this.showLoading = true
				let type = this.actionType
				let data = this.$refs['data-form'].getFormItem()
				
				if (type === 'save') {
					data['password'] = '123456'
				}
				
				data.phone = data.username
				data.role = data.work[0]
				data.job = data.work[1] || data.work[0]
				delete data['work']
				
				updateUserList(type, data).then(res => {
					if (res.code === ERR_OK) {
						this.search(this.page)
						this.$refs['action-model'].hideModel()
						this._getOgnList()
						successNotice('操作成功')
					}else {
						errorNotice(res.message, true)
					}
					this.showLoading = false
				})
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
				
				updateUserList(type, data).then(res => {
					if (res.code === ERR_OK) {
						this.search(this.page)
						this._getOgnList()
						successNotice('操作成功')
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			resetPsw(row) {
				this.rowIng = cloneObj(row)
				this.$refs['psw-warnModel'].showModel()
			},
			resetCommit() {
				this.showLoading = true
				this.$refs['psw-warnModel'].hideModel()
				let data = {
					userid: this.rowIng.userid
				}
				
				resetUserPsw(data).then(res => {
					if (res.code === ERR_OK) {
						this.search(this.page)
						successNotice('操作成功')
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			search(page) {
				let search = {}
				if(this.searchValue.realname) {
					search.realname = likeStrSearch(this.searchValue.realname)
				}
				if(this.searchValue.username) {
					search.username = likeStrSearch(this.searchValue.username)
				}
				if(this.searchValue.institution) {
					search.institution = likeStrSearch(this.searchValue.institution)
				}
				if(this.searchValue.audit_status) {
					search.audit_status = this.searchValue.audit_status
				}
				if(this.searchValue.role) {
					search.role = this.searchValue.role
				}
				this._getUserList(page, search)
			},
			pageChange(page) {
				this.page = page
				this.search(page)
			},
			_getUserList(page, search) {
				this.showLoading = true							
				getUserList(page, search).then(res => {
					if (res.code === ERR_OK) {
						console.log(this.tableTbody)
						this.tableTbody = res.result.result
						console.log(this.tableTbody)
						this.total = res.result.totalSize
						this.current = res.result.page
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			_getOgnList() {
				getOgnList().then(res => {
					if (res.code === ERR_OK) {
						this.SET_INSTITUTION(res.result)
					}else {
						errorNotice()
					}
				})
			},
			...mapMutations([
				'SET_INSTITUTION'
			])
		}
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');
	@import url('~common/less/animate.less');

	.user-management {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.user-management-warpper {
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
		.action-model {
			width: 480px;
			height: 350px;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			.action-content {
				width: 300px;
				padding-top: 20px;
				margin: auto;
				.action-warpper {
					width: 100%;
					.action-formItems {
						width: 100%;
						.formItems-warpper {
							width: 100%;
							position: relative;
						}
						.formItems-commit {
							position: absolute;
							bottom: 10px;
							right: 10px;
						}
					}
				}
			}
		}
		
	}
</style>