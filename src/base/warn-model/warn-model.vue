<template>
	<Modal v-model="show" width="250">
		<p slot="header" style="color:#f60;text-align:center">
			<Icon type="information-circled"></Icon>
			<span>{{title}}</span>
		</p>
		<div style="text-align:center">
			<p>{{message}}</p>
		</div>
		<div v-if="!isAudit" slot="footer">
			<Button type="error" size="large" long @click="sure">确认</Button>
		</div>
		<div v-if="isAudit" slot="footer">
			<Button type="success" @click="sure('通过')">通过</Button>
			<Button type="error" @click="sure('未通过')">未通过</Button>
		</div>
	</Modal>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			message: {
				type: String,
				default: ''
			},
			isCancel: {
				type: Boolean,
				default: false
			},
			isAudit: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				show: false
			}
		},
		methods: {
			sure(str) {
				if(str) {
					this.$emit('sure', str)
					return 
				}
				
				this.$emit('sure')
			},
			cancel() {
				if(!this.isCancel) {
					return
				}
				this.$emit('cancel')
			},
			showModel() {
				this.show = true
			},
			hideModel() {
				this.show = false
			}
		}
	}
</script>

<style>
	
</style>