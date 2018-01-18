<template>
	<div class="danger-list">
		<div class="danger-list-warpper" v-if="rowIng">
			<div class="list-content" ref="list-content">
				<div class="list-warpper">
					<header class="list-header">
						<div class="list-header-title">南海区水利工程施工现场安全质量进度检查记录表</div>
						<div class="list-header-rule">佛山市南海区水利投资建设有限公司制</div>
					</header>
					<div class="list-detail">
						<div class="list-task-info">
							<div class="list-task-box">
								<div class="title" >工程名字</div>
								<div class="content">{{rowIng.construction.name}}</div>
							</div>
							<div class="list-task-box list-task-box-right">
								<div class="title">检查日期</div>
								<div class="content">{{date(rowIng.ymd)}}</div>
							</div>
						</div>
						<div class="list-task-info">
							<div class="list-task-box">
								<div class="title" >检查单位</div>
								<div class="content">佛山市南海区水利投资建设有限公司</div>
							</div>
							<div class="list-task-box list-task-box-right">
								<div class="title">检查人员</div>
								<div class="content">{{rowIng.inspector.realname}}</div>
							</div>
						</div>
						<div class="list-task-question">
							<div class="title">工程现场检查情况：</div>
							<div class="content">{{rowIng.state}}</div>
						</div>
						<div class="list-task-checkTitle">
							一、安全检查
						</div>
						<div class="list-task-checks" v-for="item in patrolExpandSafeData">
							<div class="title">{{item.key}}:</div>
							<div class="checkSaft-lists" v-html="checkHtml(item.key, item.data)"></div>
						</div>
						<div class="list-task-checkTitle">
							二、质量检查
						</div>
						<div class="list-task-checks" v-for="item in patrolExpandWeightData">
							<div class="title">{{item.key}}:</div>
							<div class="checkSaft-lists" v-html="checkHtml(item.key, item.data)"></div>
						</div>
						<div class="list-task-checkTitle">
							三、进度检查
						</div>
						<div class="list-task-checks" v-for="item in patrolExpandProgessData">
							<div class="title">{{item.key}}:</div>
							<div class="checkSaft-lists" v-html="checkHtml(item.key, item.data)"></div>
						</div>
						<div class="list-task-checkTitle" v-if="rowIng.pics">
							整改前图片
						</div>
						<div class="list-task-checks" v-if="rowIng.pics">
							<div class="list-mission-img clear">
								<div v-for="item in rowIng.pics" class="pull-left">
									<img 
										class="list-mission-img" 
										:src="filterImgUrl(item)"/>
								</div>
							</div>
						</div>
						<div class="list-task-checkTitle" v-if="rowIng.rectificationInfo">
							整改后图片
						</div>
						<div class="list-task-checks" v-if="rowIng.rectificationInfo">
							<div class="list-mission-img clear" >
								<div v-for="item in rowIng.rectificationInfo.pics" class="pull-left">
									<img 
										class="list-mission-img" 
										:src="filterImgUrl(item)"/>
								</div>
							</div>
						</div>
						<div class="list-task-remark">
							相关责任单位须按照相关法规、规范及技术标准的要求在<span class="remark-date">{{rowIng.timeout}}</span>天内对上述问题整改落实并书面回复，杜绝工程质量安全隐患等问题。
						</div>
						<div class="list-task-autograph">
							<div class="read-company">
								<div class="title">监理单位</div>
								<div class="content">{{rowIng.construction.supervisor_institution}}</div>
							</div>
							<div class="read-company-info">
								<div class="title">签收人：</div>
								<div class="content">年<span>月</span>日</div>
							</div>
							<div class="check-company">
								<div class="title">受查单位</div>
								<div class="content">{{rowIng.construction.construction_institution}}</div>
							</div>
							<div class="check-company-info">
								<div class="title">签收人：</div>
								<div class="content">年<span>月</span>日</div>
							</div>
						</div>
					</div>
					<footer class="list-task-explain">
						<div class="title">说明：</div>
						<div class="content">
							<div>1.水投公司工程部现场项目负责人对照本检查记录表，每周至少填写两次。</div>
							<div>2.填写后发给相关单位，若未在整改期限内完成，水投公司将正式下发整改通知，并视情况书面上报上级主管部门，作为违约处理的依据。</div>
						</div>
					</footer>
				</div>
			</div>
			
			<div class="list-print pull-right" @click="print">
				<Button type="primary">打印</Button>
			</div>
		</div>
		
		<!--<iframe ref="iframe" class="list-iframe" src="static/print/danger-list.html"></iframe>-->

		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { loadingMixin } from 'common/js/mixins'
	import { patrolExpandSafeData, patrolExpandWeightData, patrolExpandProgessData } from 'common/js/module'
	import { errorNotice } from 'common/js/dom'
	import { httpUrl, ERR_OK } from 'api/config'
	import { getMissionList } from 'api/patrol-mission'
	
	export default {
		mixins: [loadingMixin],
		computed: {
			
		},
		created() {
			this._getMissionList()
		},
		data() {
			return {
				showLoading: false,
				rowIng: null,
				checkItem: {},
				patrolExpandSafeData: patrolExpandSafeData,
				patrolExpandWeightData: patrolExpandWeightData,
				patrolExpandProgessData: patrolExpandProgessData
			}
		},
		methods: {
			date(str) {
				let arr = str.split('-')
				return `${arr[0]} 年 ${arr[1]} 月 ${arr[2]} 日`
			},
			filterImgUrl(str) {
				return `${httpUrl}${str}`
			},
			checkHtml(key, data) {
				if (!data) {
					return
				}
				let str = ''
				let checkItem = this.rowIng.checkitem[key]
				data.map((item, index) => {
					if (index) {
						str += '&nbsp;&nbsp;&nbsp;'
					}
					if (checkItem[item.key] === '通过') {
						str += 	'<div class="danger-list-box" style="margin-right: 2px;">' + 
									'<div class="iconfont icon-gou danger-list-icon"></div>' +
								'</div>'
						str += item.key
					}else {
						str += '<div class="danger-list-box" style="margin-right: 2px;">'	+
									'<div class="iconfont icon-chaguanbi danger-list-icon"></div>' +
							   '</div>'
						str += `<span style="color: red;">${item.key}</span>`
					}
					
				})
				
				return str
			},
			print() {
				window.print()
//				let iframe = this.$refs['iframe']
//				iframe.contentWindow.print()
//				let doc = iframe.contentWindow.document  
//				let body = doc.getElementsByTagName('body')[0]
//			    let codestr = this.$refs['list-content'].innerHTML
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

<style lang="less">
	.danger-list {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: auto;
		.danger-list-warpper {
			width: 660px;
			font-size: 14px;
			margin: auto;
			.list-content {
				width: 100%;
				@import url('~common/less/list-print');
			}
			.list-print {
				margin-top: 20px;
			}
		}
		.list-iframe {
			display: none;
			visibility: hidden;
		}
	}
	
	@media print {
		.list-print {
			display: none;
			opacity: 0
		}
	}
	
	
</style>