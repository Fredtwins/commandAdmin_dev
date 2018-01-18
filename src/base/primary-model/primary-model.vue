<template>
	<Modal v-model="show" width="250">
		<p slot="header" class="primary-model-header">
			<Icon type="information-circled"></Icon>
			<span>{{title}}</span>
		</p>
		<div>
			<slot></slot>
		</div>
		<div slot="footer">
			<Button type="primary" size="large" long @click="sure">确认</Button>
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
			isCancel: {
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

<style scoped lang="less">
	@import url('~common/less/color');
	.primary-model-header {
		text-align: center;
		color: @color-default;
	}
</style>