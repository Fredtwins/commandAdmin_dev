<template>
	<div class="notice-single">
		<div class="notice-single-warpper">
			<div class="title">
				<base-title title="通知公告管理"></base-title>
			</div>
			<div class="bread-menu">
				<Breadcrumb>
			        <BreadcrumbItem href="/home/noticeManagement">通知公告管理</BreadcrumbItem>
			        <BreadcrumbItem>操作</BreadcrumbItem>
			    </Breadcrumb>
			</div>
			<div class="notice-form clear">
				<div class="notice-row pull-left">
					<div class="notice-item">
						<div class="notice-title">公告标题</div>
						<div class="notice-input">
							<Input 
								v-model="formItem.notice_title" 
								placeholder="公告标题"
								@on-focus="formFocus('notice_title')"></Input>
						</div>
						<transition name="fade">
							<div class="formItem-error" v-show="formItemERR.notice_title">公告标题不能为空</div>
						</transition>
					</div>
					<div class="notice-item">
						<div class="notice-title">公告类型</div>
						<div class="notice-input">
							<Select 
								v-model="formItem.notice_category" 
								placeholder="公告类型">
								<Option value="一般通知">一般通知</Option>
						        <Option value="放假通知">放假通知</Option>
						        <Option value="灾害通知">灾害通知</Option>
						  </Select>
						</div>
					</div>
					<div class="notice-item">
						<div class="notice-title">公告状态</div>
						<div class="notice-input">
							<Select 
								v-model="formItem.state" 
								placeholder="公告状态">
						        <Option :value="1">显示</Option>
						        <Option :value="0">不显示</Option>
						   </Select>
						</div>
					</div>
				</div>
				<div class="pull-left">
					<div class="notice-commit" @click="commit">
						<Button type="primary">保存</Button>
					</div>
				</div>
			</div>
			<div class="notice-ue">
				<UE ref="ue" @ready="ueReady"></UE>	
			</div>
		</div>

		<loading v-show="showLoading" style="z-index: 1000;"></loading>
	</div>
</template>

<script>
	import UE from 'base/ue/ue'
	import { baseTitleMixin, loadingMixin } from 'common/js/mixins'
	import { errorNotice, successNotice , errorMessage } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getNoticeList, updateNoticeList } from 'api/notice-management'

	export default {
		mixins: [baseTitleMixin, loadingMixin],
		components: {
			'UE': UE
		},
		mounted() {
			setTimeout(() => {
				this.initEdit()				
			}, 20)
		},
		computed: {
			type() {
				return this.$route.params.name === 'add' ? 'save' : 'edit'
			}
		},
		data() {
			return {
				formItem: {
					notice_title: '',
					notice_category: '一般通知',
					state: 1
				},
				formItemERR: {
					notice_title: false,
				},
				showLoading: false
			}
		},
		methods: {
			commit() {
				if (!this.formItem['notice_title']) {
					this.formItemERR['notice_title'] = true
				}
				
				if (this.formItemERR['notice_title']) {
					return
				}
				
				let content = this.getContent()
				
				if (!content) {
					errorMessage('通知公告内容不能为空')
					return
				}
				
				this.formItem['notice_content'] = this.getContent()
				
				delete this.formItem['_id']
				
				this._updateNoticeList(this.formItem)
			},
			formFocus(key) {
				this.formItemERR[key] = false
			},
			initEdit() {
				let arr = this.$route.params.name.split('_')
				
				if (arr[0] === 'add') {
					return
				}
				
				if (arr[0] === 'edit') {
					let name = arr[1]
					this._getNoticeList(name)
					return 
				}
				this.$router.push('/home/noticeManagement')
			},
			ueReady() {
				this.canSetUe = true
			},
			getContent() {
		   		return this.$refs.ue.getContent()
		   	},
			setContent(str) {
				if (this.canSetUe) {
					this.$refs.ue.setContent(str)
				}else {
					setTimeout(() => {
						this.setContent(str)
					}, 40)
				}
			},
			_updateNoticeList(data) {
				this.showLoading = true
				updateNoticeList(this.type, data).then(res => {
					if (res.code === ERR_OK) {
						if (this.type === 'save') {
							this.formItem = {
								notice_title: '',
								notice_category: '一般通知',
								state: 1
							}
							this.setContent('')
						}
						successNotice('操作成功')
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			_getNoticeList(name) {
				this.showLoading = true
				let search = {
					noticeid: name
				}
				getNoticeList(1, search).then(res => {
					if (res.code === ERR_OK) {
						if (res.result.result.length) {
							this.formItem = res.result.result[0]
							this.setContent(this.formItem.notice_content)	
						}else {
							this.$router.push('/home/noticeManagement')
						}
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			}
		}
	}
</script>

<style lang="less">
	@import url('~common/less/color');
	@import url('~common/less/animate');

	.notice-single {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.notice-single-warpper {
			width: 100%;
			min-height: 100%;
			padding: 10px;
			position: relative;
			background-color: white;
			.title {
				padding: 10px 0 20px;
			}
			.bread-menu {
				margin-bottom: 10px;
			}
			.notice-form {
				width: 100%;
				height: 50px;
				.notice-row {
					width: 750px;
					display: flex;
					align-items: center;
					padding-bottom: 15px;
					.notice-item {
						flex: 1;
						display: flex;
						align-items: center;
						position: relative;
						.notice-title {
							flex: 0 0 60px;
							font-size: 12px;
							text-align: right;
							padding-right: 5px;
						}
						.notice-input {
							flex: 1;
							font-size: 12px;
							.ivu-select-dropdown {
								z-index: 1000;
							}
						}
						.formItem-error {
							color: red;
							font-size: 12px;
							position: absolute;
							left: 65px;
							bottom: -19px;
						}
						
					}
				}
				.notice-commit {
					width: 100%;
					padding-left: 20px;
				}
			}
		}
	}
</style>