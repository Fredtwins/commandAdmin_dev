<template>
	<div class="danger-status">
		<Steps :current="current">
	        <Step 
	        	v-for="(item, index) in stepArr"
	        	:title="item.title"
	        	:status="item.status || 'wait'">
	        	<div style="font-size: 12px;">{{item.content}}</div>
	        	<div v-if="index === 0" class="danger-print" style="font-size: 12px;" @click="print(0)">点击打印巡查记录表</div>
	        	<div v-if="index === 1" class="danger-print" style="font-size: 12px;" @click="print(1)">点击打印整改通知书</div>
	        </Step>
	    </Steps>
	</div>
</template>

<script>
	import { dangerManagementSteps } from 'common/js/module'
	
	export default {
		props: {
			row: {
				type: Object,
				default: {}
			}
		},
		created() {
			this.initStep()
		},
		data() {
			return {
				stepArr: dangerManagementSteps(),
				current: 1
			}
		},
		methods: {
			print(index) {
				if (index === 0) {
					window.open(`${location.origin}${location.pathname}#/dangerList/${this.row.taskid}`, '_blank')
					return
				}
				
				if (index === 1) {
					window.open(`${location.origin}${location.pathname}#/dangerEdit/${this.row.taskid}`, '_blank')
				}
			},
			initStep() {
				let row = this.row
				
				let index = 1
				if (row.supervisor_readed) {
					this.stepArr[1].title  = '已完成'
					this.stepArr[1].status  = 'finish'
					index = 2
				}
				if (row.constructor_readed) {
					this.stepArr[2].title  = '已完成'
					this.stepArr[2].status  = 'finish'
					index = 3
				}
				
				if (row.pm_confirm) {
					this.stepArr[3].title  = '已完成'
					this.stepArr[3].status  = 'finish'
					index = 4
				}
				if(row.chiefsupervisor_confirm) {
					this.stepArr[4].title  = '已完成'
					this.stepArr[4].status  = 'finish'
					index = 5
				}
				
				this.current = index
			}
		}
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');
	.danger-print {
		cursor: pointer;
		color: @color-default;
		text-decoration: underline;
	}
	.danger-print:hover {
		
	}
</style>