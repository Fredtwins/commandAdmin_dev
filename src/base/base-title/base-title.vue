<template>
	<div class="base-title">
		<div class="base-title-warpper">
			<div class="decorate"></div>
			<div class="content">{{title}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');

	.base-title {
		width: 100%;
		.base-title-warpper {
			width: 100%;
			height: 100%;
			display: flex;
			>.decorate {
				width: 6px;
				height: 24px;
				margin: auto 0;
				margin-right: 10px;
				background-color: @color-default;
				border-radius: 0 4px 4px 0;
			}
			>.content {
				flex: 1;
				font-size: 24px;
				line-height: 30px;
			}
		}
	}
</style>