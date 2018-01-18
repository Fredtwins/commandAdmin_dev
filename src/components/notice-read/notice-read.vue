<template>
	<div class="notice-read">
		<div class="notice-title">{{title}}</div>
		<div class="notice-info">
			<span class="peorson">{{person}}</span>
			<span class="time">{{time}}</span>
		</div>
		<div class="notice-content" v-html="notice"></div>
		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { loadingMixin } from 'common/js/mixins'
	import { errorNotice } from 'common/js/dom'
	import { ERR_OK } from 'api/config'
	import { getNotice } from 'api/notice-management'
	
	export default {
		mixins: [loadingMixin],
		created() {
			this._getNotice(this.$route.params.name)
		},
		data() {
			return {
				title: '',
				person: '',
				time: '',
				notice: '',
				showLoading: false
			}
		},
		methods: {
			_getNotice(name) {
				this.showLoading = true
				getNotice(name).then(res => {
					if (res.code === ERR_OK) {
						this.title = res.result.notice_title
						this.person = res.result.creator.realname
						this.time = res.result.create_time
						this.notice = res.result.notice_content
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			}
		}
	}
</script>

<style lang="less">
	.notice-read {
		padding-top: 15px;
		overflow: auto;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		.notice-title {
			width: 100%;
			text-align: center;
		}
		.notice-info {
			width: 100%;
			text-align: center;
			font-size: 14px;
			.time {
				color: lightgray;
			}
		}
		.notice-content {
			margin-top: 15px;
		}
		@media only screen and (max-width: 767px) {
			img{ 
				width: 100%;
				height: auto !important; 
			}			
		}
	}
</style>