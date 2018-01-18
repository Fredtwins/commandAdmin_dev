<template>
	 <div class="patrol-mission-expand">
	 	<div class="patrol-mission-lists">
	 		<div class="patrol-mission-title">
	 			一、安全检查
	 		</div>
	 		<div class="patrol-mission-warpper">
	 			<div class="patrol-mission-details" v-for="item in patrolExpandSafeData">
	 				<span>{{item.key}}</span>
	                <div class="patrol-mission-detail">
	                	<div 
	                		class="patrol-mission-content" 
	                		v-if="item.htmls"
	                		v-html="item.htmls">	                        		
	                	</div>
	                	<div class="patrol-mission-noPromble" v-if="!item.htmls">
	                		未发现隐患
	                	</div>
	                </div>
	 			</div>
	 		</div>
	 	</div>
	 	<div class="patrol-mission-lists">
	 		<div class="patrol-mission-title">
	 			二、质量检查
	 		</div>
	 		<div class="patrol-mission-warpper">
	 			<div class="patrol-mission-details" v-for="item in patrolExpandWeightData">
	 				<span>{{item.key}}</span>
	                <div class="patrol-mission-detail">
	                	<div 
	                		class="patrol-mission-content" 
	                		v-if="item.htmls"
	                		v-html="item.htmls">	                        		
	                	</div>
	                	<div class="patrol-mission-noPromble" v-if="!item.htmls">
	                		未发现隐患
	                	</div>
	                </div>
	 			</div>
	 		</div>
	 	</div>
	 	<div class="patrol-mission-lists">
	 		<div class="patrol-mission-title">
	 			三、进度检查
	 		</div>
	 		<div class="patrol-mission-warpper">
	 			<div class="patrol-mission-details" v-for="item in patrolExpandProgessData">
	 				<span>{{item.key}}</span>
	                <div class="patrol-mission-detail">
	                	<div 
	                		class="patrol-mission-content" 
	                		v-if="item.htmls"
	                		v-html="item.htmls">	                        		
	                	</div>
	                	<div class="patrol-mission-noPromble" v-if="!item.htmls">
	                		未发现隐患
	                	</div>
	                </div>
	 			</div>
	 		</div>
	 	</div>
    </div>
</template>

<script>
	import { patrolExpandSafeData, patrolExpandWeightData, patrolExpandProgessData } from 'common/js/module'
	
	export default {
		props: {
			row: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		watch: {
			row() {
				this.intiRow()
			}
		},
		created() {
			this.intiRow()
		},
		data() {
			return {
				patrolExpandSafeData: [],
				patrolExpandWeightData: [],
				patrolExpandProgessData: []
			}
		},
		methods: {
			intiRow() {
				this.patrolExpandSafeData = []
				patrolExpandSafeData.map((items, index) => {
					let str = ''
					for(let key in this.row.checkitem[items.key]) {
						if (this.row.checkitem[items.key][key] === '不通过') {
							str += `${key}、`
						}
					}
					setTimeout(() => {
						if (str.length) {
							this.patrolExpandSafeData.push({
								key: `${index + 1}、${items.key}`,
								htmls: str.substring(0, str.length - 1)
							})
						}else {
							this.patrolExpandSafeData.push({
								key: `${index + 1}、${items.key}`,
								htmls: ''
							})
						}
					}, 20)
				})
				
				this.patrolExpandWeightData = []
				patrolExpandWeightData.map((items, index) => {
					let str = ''
					for(let key in this.row.checkitem[items.key]) {
						if (this.row.checkitem[items.key][key] === '不通过') {
							str += `${key}、`
						}
					}
					setTimeout(() => {
						if (str.length) {
							this.patrolExpandWeightData.push({
								key: `${index + 1}、${items.key}`,
								htmls: str.substring(0, str.length - 1)
							})
						}else {
							this.patrolExpandWeightData.push({
								key: `${index + 1}、${items.key}`,
								htmls: ''
							})
						}
					}, 20)
				})
				
				this.patrolExpandProgessData = []
				patrolExpandProgessData.map((items, index) => {
					let str = ''
					for(let key in this.row.checkitem[items.key]) {
						if (this.row.checkitem[items.key][key] === '不通过') {
							str += `${key}、`
						}
					}
					setTimeout(() => {
						if (str.length) {
							this.patrolExpandProgessData.push({
								key: `${index + 1}、${items.key}`,
								htmls: str.substring(0, str.length - 1)
							})
						}else {
							this.patrolExpandProgessData.push({
								key: `${index + 1}、${items.key}`,
								htmls: ''
							})
						}
					}, 20)
				})
			},
			isChecked(obj) {
				let str = ''
				for(let key in obj) {
					if (obj[key] === '不通过') {
						str += `${key}、`
					}
				}
				console.log(str.substring(0, str.length - 1))
				return str.substring(0, str.length - 1)
			}
		}
	}
</script>

<style scoped lang="less">
	.patrol-mission-expand {
		width: 100%;
		.patrol-mission-lists {
			.patrol-mission-title {
				text-align: center;
				padding: 5px 0;
				font-size: 14px;
			}
			.patrol-mission-warpper {
				.patrol-mission-details {
					.patrol-mission-detail {
						padding-left: 20px;
						.patrol-mission-content {
							color: #ed3f14;
						}
						.patrol-mission-noPromble {
							color: #19be6b;
						}
					}
				}
			}
		}
	}
</style>