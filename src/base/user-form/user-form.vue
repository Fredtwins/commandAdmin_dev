<template>
	<div class="user-form">
		<Form :model="formItem" :rules="rules" ref="formItem" :label-width="80" v-if="InstitutionList.length">
			<FormItem class="action-formItem" label="用户属性" prop="work">
	          	<Cascader :data="workData" v-model="formItem.work" placeholder="请选择用户属性"></Cascader>
	       	</FormItem>
	       	<FormItem class="action-formItem" label="所在单位" prop="institution">
	          	<Poptip v-model="showPoptip" placement="bottom" width="220">
	          		<Input v-model="formItem.institution" placeholder="请输入所在单位"></Input>
	          		<div class="institution-warpper" slot="content">
	          			<ul class="institution-lists">
	          				<li 
	          					v-for="item in InstitutionList" 
	          					class="institution-list" 
	          					:class="{'institution-active': formItem.institution === item.institution}"
	          					@click="institutionClick(item)">
	          					{{item.institution}}
	          				</li>
	          			</ul>
	          		</div>
	          	</Poptip>
	       	</FormItem>
	       	<FormItem class="action-formItem" label="手机号码" prop="username">
	          	<Input v-model="formItem.username" :readonly="isReadonlyUserNmae" placeholder="请输入手机号码"></Input>
	       	</FormItem>
	       	<FormItem class="action-formItem" label="真实姓名" prop="realname">
	       		<Input v-model="formItem.realname" placeholder="请输入真实姓名"></Input>
	       	</FormItem>
	       	<FormItem class="action-formItem" label="身份证" prop="identification">
	          	<Input v-model="formItem.identification" placeholder="请输入身份证"></Input>
	       	</FormItem>
		</Form>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { userManagementRules } from 'common/js/rules'
	import { userManagementWork } from 'common/js/module'
	import { cloneObj } from 'common/js/util'
	
	export default {
		props: {
			isReadonlyUserNmae: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			InstitutionList() {
				let arr = []
				switch(this.formItem.work[0]) {
					case '施工方':
						this.Institution.map(item => {
							if (item.role === '施工方') {
								arr.push(item)
							}
						})
						break;
					case '监理方':
						this.Institution.map(item => {
							if (item.role === '监理方') {
								arr.push(item)
							}
						})
						break;
					default:
						arr = this.Institution
						break;
				}
				return arr
			},
			...mapGetters([
				'Institution'
			])
		},
		data() {
			return {
				formItem: {
					work: [],
					institution: '',
					username: '',
					realname: '',
					identification: ''
				},
				rules: userManagementRules,
				workData: userManagementWork,
				showPoptip: false
			}
		},
		methods: {
			institutionClick(item) {
				this.formItem.institution = item.institution
				this.showPoptip = false
			},
			getFormItem() {
				return cloneObj(this.formItem)
			},
			setFormItems(obj) {
				this.formItem = obj
			},
			setFormItem(key, val) {
				this.$set(this.formItem, key, val)
			},
			initFormItem() {
				this.formItem = {
					work: [],
					institution: '',
					username: '',
					realname: '',
					identification: ''
				}
			},
			validate() {
				let bol = false
				this.$refs.formItem.validate((valid) => {
                   	bol = valid
               	})
				return bol
			},
			clearValidate() {
				this.$refs.formItem.resetFields()
			}
		}
	}
</script>

<style lang="less">
	.user-form {
		.institution-warpper {
			width: 100%;
			max-height: 180px;
			overflow: auto;
			.institution-lists {
				.institution-list {
					padding: 5px;
					color: #495060;
					cursor: pointer;
				}
				.institution-list:hover {
					background-color: #f3f3f3;
				}
				.institution-active {
					background-color: #f3f3f3;
				}
			}
		}
		.ivu-poptip {
			width: 100%;
			.ivu-poptip-rel {
				width: 100%;
			}
			.ivu-poptip-body {
				padding: 0;
			}
			.ivu-poptip-arrow {
				display: none;
			}
		}
		.action-formItem {
			margin-bottom: 15px;
			.ivu-form-item-error-tip {
				padding-top: 2px;
			}
		}
	}
</style>