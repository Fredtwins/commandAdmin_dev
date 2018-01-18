<template>
	<transition name="scale">
		<div class="patrol-track" v-show="show">
			<div class="patrol-track-warpper">
				<div class="patrol-track-content">
					<div class="track-date">
						<Cascader :data="dateData" v-model="dates" @on-change="dateChange" placeholder="请选择巡查月份"></Cascader>
						<transition name="fade">
							<div class="track-error" v-show="showError.timeError">请选择巡查月份</div>
						</transition>
					</div>
					<div class="track-user" v-if="userData">
						<Select v-model="user" @on-change="userChange" placeholder="请选择巡查员" filterable clearable>
			                <Option v-for="item in userData" :value="item.userid" :key="item.realname">{{ item.realname }}</Option>
			            </Select>
			            <transition name="fade">
							<div class="track-error" v-show="showError.roleError">请选择巡查员</div>
						</transition>
					</div>
					<div class="track-sure" @click="sure">
						<Button type="info" long>查找轨迹</Button>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import { calendarData } from 'common/js/module'
	import { ERR_OK } from 'api/config'
	import { getUserAll, getMissionList } from 'api/patrol-track'
	import { errorNotice } from 'common/js/dom'
	
	export default {
		created() {
			this._getUserAll()
		},
		data() {
			return {
				show: false,
				user: '',
				userData: null,
				dates: [],
				dateData: calendarData,
				showError: {
					timeError: false,
					roleError: false
				}
			}
		},
		methods: {
			sure() {
				this._getMissionList()
			},
			dateChange(time) {
				this.dates = time
				if (this.showError.timeError) {
					this.showError.timeError = false
				}
			},
			userChange(val) {
				this.user = val
				if (this.showError.roleError) {
					this.showError.roleError = false
				}
			},
			showTrack() {
				this.show = true				
			},
			hideTrack() {
				this.show = false
			},
			_getMissionList() {
				if (!this.dates.length) {
					this.showError.timeError = true
				}
				if (!this.user) {
					this.showError.roleError = true
				}
				
				if (this.showError.timeError || this.showError.roleError) {
					return
				}
				
				this.$parent.showLoading = true
				
				let search = {}
				search['inspector.userid'] = this.user
				search['ym'] = `${this.dates[0]}-${this.dates[1]}`
				getMissionList(search).then(res => {
					if (res.code === ERR_OK) {
						this.$emit('draw', res.result.result)
//						console.log(res.result.result)
//						this.$emit('draw', [{
//							construction: {
//								lnt: 113.05,
//								lat: 22.98
//							}
//						}, {
//							construction: {
//								lnt: 113.01,
//								lat: 22.99
//							}
//						}, {
//							construction: {
//								lnt: 113.08,
//								lat: 22.99
//							}
//						}])
					}else {
						errorNotice()
					}
					this.$parent.showLoading = false
				})
			},
			_getUserAll() {
				let search = {
					role: '巡查员'
				}
				getUserAll(search).then(res => {
					if (res.code === ERR_OK) {
						this.userData = res.result.result
					}else {
						errorNotice()
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.patrol-track {
		width: 210px;
		position: fixed;
		top: 150px;
		right: 0;
		.patrol-track-warpper {
			width: 100%;
			height: 100%;
			.patrol-track-show {
				width: 35px;
				height: 125px;
				font-size: 14px;
				text-align: center;
				cursor: pointer;
				padding: 8px;
				background-color: rgba(245, 245, 245, .8);
				border-radius: 0 5px 5px 0;
			}
			.patrol-track-content {
				width: 100%;
				height: 100%;
				background-color: #eee;
				padding: 10px;
				.track-date, .track-user {
					width: 180px;
					height: 50px;
					position: relative;
				}
				.track-sure {
					width: 180px;
				}
				.track-table {
					position: absolute;
					left: 5px;
					right: 5px;
					top: 40px;
					bottom: 5px;
				}
				.track-error {
					width: 150px;
					color: red;
					font-size: 12px;
					position: absolute;
					left: 5px;
					bottom: 0px;
				}
			}
		}
	}
	.scale-enter-active, .scale-leave-active {
		transition: all .3s
	}
	.scale-enter, .scale-leave-to {
		transform: translateX(100%);
	}
</style>