<template>
	<div class="danger-edit">
		<div class="danger-edit-warpper" v-if="rowIng">
			<div class="edit-content" ref="edit-content">
				<div class="edit-warpper">
					<header class="edit-header">
						<div>佛山市南海区水利投资建设有限公司水利工程建设</div>
						<div>质量、安全生产检查情况及整改要求通知书</div>
					</header>
					<div class="edit-detail">
						<div class="edit-task-name">
							<div class="title">工程名称</div>
							<div class="content">{{rowIng.construction.name}}</div>
						</div>
						<div class="edit-task-company">
							<div class="make-company">
								<div class="title" >监理单位</div>
								<div class="content">{{rowIng.construction.supervisor.institution}}</div>
							</div>
							<div class="read-company">
								<div class="title">施工单位</div>
								<div class="content">{{rowIng.construction.construction_institution}}</div>
							</div>
						</div>
						<div class="edit-task-question">
							<div class="question-title">经抽(复查)查，安全生产管理/施工现场存在以下主要问题:</div>
							<div class="question-content">
								<div class="check-warpper" v-if="checkItem['安全检查']" >
									<div>安全检查</div>
									<div class="check-box" v-if="checkItem['安全检查'][item.key]" v-for="item in patrolExpandSafeData">
										<div class="check-title">{{item.key}}:</div>
										<div class="check-content">{{checkItem['安全检查'][item.key]}}</div>
									</div>
								</div>
								<div class="check-warpper" v-if="checkItem['质量检查']" >
									<div>质量检查</div>
									<div class="check-box" v-if="checkItem['质量检查'][item.key]" v-for="item in patrolExpandWeightData">
										<div class="check-title">{{item.key}}:</div>
										<div class="check-content" >{{checkItem['质量检查'][item.key]}}</div>
									</div>
								</div>
								<div class="check-warpper" v-if="checkItem['进度检查']" >
									<div>进度检查</div>
									<div class="check-box">
										<div class="check-title"></div>
										<div class="check-content">{{checkItem['进度检查']}}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="edit-task-result">
							<div class="result-content">
								请相关责任单位按照相关法规、规范及技术标准的要求对上述问题认真进行整改落实，杜绝安全隐患，并在是<span class="result-day">{{rowIng.timeout}}</span>天内对上述问题进行销项整改，将整改落实情况(附有整改后的照片)回复到区水投公司。
							</div>
							<div class="result-autograph">
								<div class="autograph-name">项目法人签名(巡查员):{{rowIng.inspector.realname}}</div>
								<div class="autograph-name">监理单位签名(总监):{{rowIng.construction.chiefsupervisor.realname}}</div>
								<div class="autograph-name">施工单位签名(项目经理):{{rowIng.construction.pm.realname}}</div>
							</div>
							<div class="result-date">{{date(rowIng.ymd)}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="edit-print pull-right" @click="print">
				<Button type="primary">打印</Button>
			</div>
		</div>
		
		<!--<iframe ref="iframe" class="edit-iframe" src="static/print/danger-edit.html" frameborder="0"></iframe>-->

		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { loadingMixin } from 'common/js/mixins'
	import { patrolExpandSafeData, patrolExpandWeightData } from 'common/js/module'
	import { errorNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getMissionList } from 'api/danger-management'

	export default {
		mixins: [loadingMixin],
		created() {
			this._getMissionList()
		},
		data() {
			return {
				showLoading: false,
				rowIng: null,
				checkItem: {},
				patrolExpandSafeData: patrolExpandSafeData,
				patrolExpandWeightData: patrolExpandWeightData
			}
		},
		methods: {
			date(str) {
				let arr = str.split('-')
				return `${arr[0]} 年 ${arr[1]} 月 ${arr[2]} 日`
			},
			check(obj) {
				let data = {}
				for(let key in obj.checkitem) {
					for(let keys in obj.checkitem[key]) {
						if(obj.checkitem[key][keys] === '不通过') {
							data[key] = data[key] || []
							data[key].push(keys)
						}
					}
				}

				let newData = {}
				for(let key in data) {
					switch(key) {
						case '常规项目':
						case '施工现场':
						case '施工风、水、电及通讯':
						case '安全防护设施':
						case '焊接与气割、危险品管理':
							if(newData['安全检查'] === undefined) {
								newData['安全检查'] = {}
							}
							newData['安全检查'][key] = data[key].join('、')
							break
						case '土方':
						case '钢砼':
						case '砌体':
						case '金属结构、机电设备及安装工程':
							if(newData['质量检查'] === undefined) {
								newData['质量检查'] = {}
							}
							newData['质量检查'][key] = data[key].join('、')
							break
						case '进度检查':
							newData['进度检查'] = data[key].join('、')
							break
					}
				}

				this.checkItem = newData
			},
			print() {
				window.print()
//				let iframe = this.$refs['iframe']
//				let doc = iframe.contentWindow.document  
//				let body = doc.getElementsByTagName('body')[0]
//			    let codestr = this.$refs['edit-content'].innerHTML
//			    body.innerHTML = codestr
//			    iframe.contentWindow.print()
//			    return true;
			},
			_getMissionList() {
				this.showLoading = true

				let search = {
					taskid: this.$route.params.name
				}

				getMissionList(1, search).then(res => {
					if(res.code === ERR_OK) {
						if(res.result.result.length) {
							this.rowIng = res.result.result[0]
							this.check(this.rowIng)
							document.getElementsByTagName('html')[0].style.overflow = 'auto'
							document.getElementsByTagName('html')[0].style.height = 'auto'
						} else {
							this.$router.push('/home/dangerManagement')
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
	.danger-edit {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: auto;
		.danger-edit-warpper {
			width: 600px;
			font-size: 14px;
			margin: auto;
			.edit-content {
				width: 100%;
				@import url('~common/less/edit-print');
			}
			.edit-print {
				margin-top: 20px;
			}
		}
		.edit-iframe {
			display: none;
			visibility: hidden;
		}
	}
	
	@media print {
		.edit-print {
			display: none;
			opacity: 0
		}
	}
</style>