<template>
	<div class="person-info">

		<div class="person-info-warpper">

			<div class="person-info-title">
				<base-title title="个人中心"></base-title>
			</div>

			<div class="person-info-content pull-left">
				<Tabs :animated="false" v-model="tabActive">
					<TabPane label="个人资料" name="base" icon="clipboard">
						<div class="base">
							<div class="formItems">
								<user-form :isReadonlyUserNmae="true" ref="data-form"></user-form>
							</div>
							<div class="hr"></div>
							<div class="commit" @click="saveBase">
								<Button type="primary" long>保存</Button>
							</div>
						</div>
					</TabPane>
					<TabPane label="修改密码" name="password" icon="locked">
						<div class="password">
							<div class="formItems">
								<div class="formItems-detail">
									<div class="resetPsw-title">
										<span>*&nbsp;</span>原密码
									</div>
									<div class="resetPsw-input">
										<Input type="password" v-model="pswFormItem.oldPassword" @on-focus="oldPswFocus"></Input>
									</div>
									<transition name="fade">
										<div class="resetPsw-error" v-show="pswFormItem.showOldError">原密码不能为空</div>
									</transition>
								</div>
								<div class="formItems-detail">
									<div class="resetPsw-title">
										<span>*&nbsp;</span>新密码
									</div>
									<div class="resetPsw-input">
										<Input type="password" v-model="pswFormItem.newPassword" @on-focus="newPswFocus"></Input>
									</div>
									<transition name="fade">
										<div class="resetPsw-error" v-show="pswFormItem.showNewError">新密码不能为空</div>
									</transition>
								</div>
								<div class="formItems-detail">
									<div class="resetPsw-title">
										<span>*&nbsp;</span>确认密码
									</div>
									<div class="resetPsw-input">
										<Input type="password" v-model="pswFormItem.surePassword" @on-focus="surePswFocus"></Input>
									</div>
									<transition name="fade">
										<div class="resetPsw-error" v-show="pswFormItem.showSureError">确认密码不能为空</div>
									</transition>
									<transition name="fade">
										<div class="resetPsw-error" v-show="pswFormItem.showIsNotNew">新密码和确认密码不一致</div>
									</transition>
								</div>
							</div>
							<div class="hr"></div>
							<div class="commit" @click="pswSave">
								<Button type="primary" long>保存</Button>
							</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		</div>

		<warn-model 
			title="警告" 
			message="原密码错误" 
			ref="psw-ErrorModel"
			@sure="pswErrorSure"></warn-model>

			<loading v-show="showLoading"></loading>
			
	</div>
</template>

<script>
	import userForm from 'base/user-form/user-form'
	import { mapGetters, mapMutations } from 'vuex'
	import { baseTitleMixin, loadingMixin, warnModelMixin } from 'common/js/mixins'
	import { successNotice, errorNotice } from 'common/js/dom'
	import { cloneObj, setUserIng } from 'common/js/util'
	import { ERR_OK } from 'api/config'
	import { getOgnList, updateUserList, updateUserPsw } from 'api/user-management'

	export default {
		mixins: [baseTitleMixin, loadingMixin, warnModelMixin],
		components: {
			'user-form': userForm
		},
		computed: {
			...mapGetters([
				'User'
			])
		},
		created() {
			this._getOgnList()
		},
		mounted() {
			setTimeout(() => {
				this.initFormItem()			
			}, 20)
		},
		data() {
			return {
				tabActive: 'base',
				pswFormItem: {
					oldPassword: '',
					newPassword: '',
					surePassword: '',
					showOldError: false,
					showNewError: false,
					showSureError: false,
					showIsNotNew: false
				},
				showLoading: false
			}
		},
		methods: {
			oldPswFocus() {
				if (!this.pswFormItem.showOldError) {
					return
				}
				this.pswFormItem.showOldError = false
			},
			newPswFocus() {
				this.pswFormItem.showNewError = false
				if (!this.pswFormItem.showIsNotNew) {
					return
				}
				this.pswFormItem.showIsNotNew = false
			},
			surePswFocus() {
				this.pswFormItem.showSureError = false
				if (!this.pswFormItem.showIsNotNew) {
					return
				}
				this.pswFormItem.showIsNotNew = false
			},
			saveBase() {
				this.showLoading = true
				let type = 'edit'
				let data = this.$refs['data-form'].getFormItem()
				
				data.phone = data.username
				data.role = data.work[0]
				data.job = data.work[1] || data.work[0]
				delete data['work']

				updateUserList(type, data).then(res => {
					if(res.code === ERR_OK) {
						this._getOgnList()
						let User = cloneObj(data)
						User['work'] = [User.role, User.job]
						setUserIng(User)
						this.SET_USER(User)
						this.initFormItem()
						successNotice('操作成功')
					} else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			pswSave() {
				if (!this.pswFormItem.oldPassword) {
					this.pswFormItem.showOldError = true
				}
				if (!this.pswFormItem.newPassword) {
					this.pswFormItem.showNewError = true
				}
				if (!this.pswFormItem.surePassword) {
					this.pswFormItem.showSureError = true
				}
				if (this.pswFormItem.showOldError || this.pswFormItem.showNewError || this.pswFormItem.showSureError) {
					return
				}
				
				if (this.pswFormItem.newPassword !== this.pswFormItem.surePassword) {
					this.pswFormItem.showIsNotNew = true
					return
				}
				
				this.showLoading = true
				let type = 'edit'
				let data = {}
				
				data['username'] = this.User.username
				data['password'] = this.pswFormItem.oldPassword
				data['newPassword'] = this.pswFormItem.newPassword
				
				updateUserPsw(data).then(res => {
					if (res.code === ERR_OK) {
						this.$parent.loginBack()
						successNotice('操作成功，请重新登录。')
					}else if(res.code === '0001') {
						this.$refs['psw-ErrorModel'].showModel()
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			pswErrorSure() {
				this.$refs['psw-ErrorModel'].hideModel()
			},
			initFormItem() {
				this.$refs['data-form'].setFormItems(cloneObj(this.User))
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
				'SET_USER',
				'SET_INSTITUTION'
			])
		}
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');
	.person-info {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		.person-info-warpper {
			width: 100%;
			height: 100%;
			padding: 10px;
			position: relative;
			background-color: white;
			.person-info-title {
				padding: 10px 0 20px;
			}
			.person-info-content {
				width: 650px;
				position: absolute;
				left: 0;
				right: 0;
				margin: 0 auto;
				border: 1px solid rgb(238, 238, 238);
				padding: 20px;
				.base,
				.password {
					width: 300px;
					margin: 0 auto;
					.formItems {
						width: 100%;
						position: relative;
						.formItems-detail {
							display: flex;
							align-items: center;
							padding-bottom: 20px;
							position: relative;
							.resetPsw-title {
								flex: 0 0 70px;
								font-size: 12px;
								text-align: right;
								span {
									color: red;
									font-size: 12px;
									position: relative;
									top: 2px;
								}
							}
							.resetPsw-input {
								flex: 1;
								margin-left: 12px;
							}
							.resetPsw-error {
								width: 150px;
								color: red;
								font-size: 12px;
								position: absolute;
								left: 82px;
								bottom: 0px;
							}
						}
					}
					.hr {
						width: 100%;
						height: 1px;
						background-color: #dddee1;
						margin: 15px auto;
					}
					.commit {
						width: 30%;
						margin-left: 150px;
					}
				}
			}
		}
	}
</style>