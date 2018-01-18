<template>
	<div id="buildSite" style="font-family: '微软雅黑';">
		<transition name="appFade">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
</script>

<style scoped lang="less">
	.appFade-enter-active, .appFade-leave-active {
	  transition: all 1.2s ease;
	  overflow: hidden;
	  visibility: visible;
	  opacity: 1;
	}
	.appFade-leave-active {
		display: none;
	}
	.appFade-enter, .appFade-leave-to {
	  opacity: 0;
	  visibility: hidden;
	}
	
</style>