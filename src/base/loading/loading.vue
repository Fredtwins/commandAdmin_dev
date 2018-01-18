<template>
	<div class="loading" ref="loading">
		<div class="loading-warpper" ref="loading-warpper">
			<div class="loading-content" ref="loading-content"></div>
			<div class="loading-title">{{title}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '加载中'
			}
		},
		mounted() {
			loading.init(this.$refs['loading-content'], {
				loadtype: 22,
				color: '#039',
				scale: 0.35,
				top: '-10px'
			})
		}
	}
</script>

<style lang="less">
	.loading {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 101;
		user-select: none;
		.loading-warpper {
			width: 80px;
			height: 80px;
			padding: 10px 0;
			background-color: rgba(0, 0, 0, .6);
			border-radius: 5px;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			color: white;
			text-align: center;
			.loading-content {
				width: 100%;
				text-align: center;
			}
			.loading-title {
				width: 100%;
				position: absolute;
				bottom: 2px;
				text-align: center;
				padding: 5px;
			}
		}
	}
</style>