<template>
	<div class="home">
		<div class="nav">
			<div class="nav-img" @click="homeTabClick">
				<div class="nav-img-warpper">
					<img src="./img/logo.png"/>
				</div>
			</div>
			<div class="nav-menu">
				<scroll 
					width="12" 
					bgColor="rgba(0, 0, 0, .6)" 
					color="rgba(170, 170, 170, .3)"
					hoverColor="rgba(170, 170, 170, .6)">
					<div class="nav-menu-warpper">
						<router-link 
							tag="div" 
							class="nav-menu-tab"
							:class="{'nav-menu-tabActive': isTaskSingle === 'map'}"
							to="/home/map">
					      	<span class="iconfont icon-ditu"></span>
				            <span>地图信息</span>	
					   	</router-link>
					   	<router-link 
					   		tag="div" 
					   		class="nav-menu-tab" 
					   		:class="{'nav-menu-tabActive': isTaskSingle === 'task' || isTaskAction}"
					   		to="/home/taskManagement">
					      	<span class="iconfont icon-gongdi-"></span>
				            <span>工地管理</span>	
					   	</router-link>
					   	<router-link tag="div" class="nav-menu-tab" to="/home/userManagement">
					      	<span class="iconfont icon-yonghu"></span>
							<span>用户管理</span>
					   	</router-link>
					   	<router-link tag="div" class="nav-menu-tab" to="/home/dangerManagement">
					      	<span class="iconfont icon-fengxianbaozhang"></span>
							<span>隐患管理</span>
					   	</router-link>
					   	<router-link tag="div" class="nav-menu-tab" to="/home/attendanceManagement">
					      	<span class="iconfont icon-kaoqin"></span>
							<span>考勤记录明细</span>
					   	</router-link>
					   	<router-link 
					   		tag="div" 
					   		class="nav-menu-tab" 
					   		:class="{'nav-menu-tabActive': isPatrolSingle}"
					   		to="/home/patrolMissionHistory">
					      	<span class="iconfont icon-lishimendianyunyingjiancha01"></span>
							<span>历史巡查管理</span>
					   	</router-link>
					   	<router-link 
					   		tag="div"
					   		class="nav-menu-tab" 
					   		:class="{'nav-menu-tabActive': isNoticeSingle}"
					   		to="/home/noticeManagement">
					      	<span class="iconfont icon-gonggao"></span>
							<span>通知公告管理</span>
					   	</router-link>
					</div>
					
				</scroll>
			</div>
			<div class="nav-person">
				<div class="nav-person-warpper">
					<div class="nav-person-info" @click="personClick">
						<span class="iconfont icon-icon"></span>
						<span>{{User.realname}}</span>
					</div>
					<div class="nav-person-action" @click="loginBack">
						<span class="iconfont icon-zhuxiao"></span>
						<span class="action-back">注销</span>
					</div>
				</div>
			</div>
		</div>
		<div class="warpper">
			<router-view></router-view>			
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { scrollMixin } from 'common/js/mixins'
	import { removeUserIng } from 'common/js/util'
	
	export default {
		mixins: [scrollMixin],
		data() {
			return {
				route: {
					path: null,
					name: null					
				}
			}
		},
		computed: {
			isTaskSingle() {
				this.route.path = this.$route.path
				this.route.name = this.$route.params.name
				
				if (!this.route.name) {
					return ''
				}
				
				this.route.path = this.route.path.substring(0, this.route.path.length - this.route.name.length - 1)
				
				if (this.route.path !== '/home/taskSingle') {
					return ''
				}
				
				return this.RouterFrom === '/home/map' ? 'map' : 'task'
			},
			isTaskAction() {
				return this.route.path === '/home/taskAction' ? true : false
			},
			isPatrolSingle() {
				return this.route.path === '/home/patrolMission' ? true : false
			},
			isNoticeSingle() {
				return this.route.path === '/home/noticeSingle' ? true : false
			},
			...mapGetters([
				'RouterFrom',
				'User'
			])
		},
		methods: {
			homeTabClick() {
				this.$router.push('/home/map')
			},
			personClick() {
				this.$router.push('/home/personInfo')
			},
			loginBack() {
				this.$router.push('/')
				this.SET_USER({})
				removeUserIng()
			},
			menuChange(path) {
				this.$router.push(path)
			},
			...mapMutations([
				'SET_USER'
			])
		}
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');

	.home {
		width: 100%;
		height: 100%;
		position: relative;
		.nav {
			width: 200px;
			height: 100%;
			background-color: rgb(5, 45, 96);
			overflow: hidden;
			position: relative;
			.nav-img {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				.nav-img-warpper {
					background: linear-gradient(rgb(20, 158, 232), rgb(10, 82, 172));
					text-align: center;
					img {
						width: 80%;
					}
				}
			}
			.nav-menu {
				user-select: none;
				position: absolute;
				left: 0;
				right: 0;
				top: 131px;
				bottom: 95px;
				overflow: hidden;
				border-bottom: 1px solid rgb(9, 77, 163);
				.nav-menu-warpper {
					.nav-menu-tab {
						color: white;
						padding: 10px 0;
						padding-left: 20px;
						cursor: pointer;
						&.router-link-active, &.nav-menu-tabActive {
							color: @menu-color-default;
						}
						&:hover {
							color: @menu-color-default;
						}
						> .iconfont {
							margin-right: 5px;
						}
					}
				}
			}
			.nav-person {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				.nav-person-warpper {
					padding: 10px 0;
					.nav-person-info, .nav-person-action {
						width: 170px;
						height: 30px;
						margin: 5px auto;
						border: 1px solid @menu-color-default;
						border-radius: 15px;
						text-align: center;
						color: white;
						font-size: 14px;
						padding-top: 1px;
						cursor: pointer;
						&:hover {
							background-color: @menu-color-default;
						}
					}
				}
			}
		}
		.warpper {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 200px;
			right: 0;
		}
	}
</style>