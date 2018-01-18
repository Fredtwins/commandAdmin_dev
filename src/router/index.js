import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import store from 'src/store'
import { getUserIng } from 'common/js/util'

Vue.use(Router);

//登录
const Login = () =>
	import('components/login/login')

//通知公告预览
const NoticeRead = () =>
	import('components/notice-read/notice-read')

//首页
const Home = () =>
	import('components/home/home')

//地图
const MapInfo = () =>
	import('components/map-info/map-info')

//工地管理
const TaskManagement = () =>
	import('components/task-management/task-management')

//单个工地管理
const TaskSingle = () =>
	import('components/task-single/task-single')

//单个工地操作
const TaskAction = () =>
	import('components/task-action/task-action')

//用户管理
const UserManagement = () =>
	import('components/user-management/user-management')

//数据统计
const DataStatistics = () =>
	import('components/data-statistics/data-statistics')

//隐患管理
const dangerManagement = () =>
	import('components/danger-management/danger-management')

//打印整改通知书
const dangerEdit = () =>
	import('components/danger-print/danger-edit')

//打印巡查记录表
const dangerList = () =>
	import('components/danger-print/danger-list')

//考勤记录管理
const attendanceManagement = () =>
	import('components/attendance-management/attendance-management')

//考勤记录打印
const attendanceList = () =>
	import('components/attendance-print/attendance-list')

//巡查任务管理
const PatrolMission = () =>
	import('components/patrol-mission/patrol-mission')

//历史巡查管理
const PatrolMissionHistory = () =>
	import('components/patrol-mission-history/patrol-mission-history')

//通知公告管理
const NoticeManagement = () =>
	import('components/notice-management/notice-management')

//单个通知公告管理
const NoticeSingle = () =>
	import('components/notice-single/notice-single')

//个人中心
const PersonInfo = () =>
	import('components/person-info/person-info')

const router = new Router({
	routes: [{
		path: '*',
		redirect: '/'
	}, {
		path: '/',
		component: Login
	}, {
		path: '/attendanceList/:name',
		component: attendanceList
	}, {
		path: '/dangerEdit/:name',
		component: dangerEdit
	}, {
		path: '/dangerList/:name',
		component: dangerList
	}, {
		path: '/noticeRead/:name',
		component: NoticeRead
	}, {
		path: '/home',
		redirect: '/home/map',
		component: Home,
		children: [{
			path: '/home/map',
			component: MapInfo
		}, {
			path: '/home/userManagement',
			component: UserManagement
		}, {
			path: '/home/taskSingle/:name',
			component: TaskSingle
		}, {
			path: '/home/taskAction/:name',
			component: TaskAction
		}, {
			path: '/home/dataStatistics',
			component: DataStatistics
		}, {
			path: '/home/patrolMission/:name',
			component: PatrolMission
		}, {
			path: '/home/patrolMissionHistory',
			component: PatrolMissionHistory
		}, {
			path: '/home/dangerManagement',
			component: dangerManagement
		}, {
			path: '/home/attendanceManagement',
			component: attendanceManagement
		}, {
			path: '/home/taskManagement',
			component: TaskManagement
		}, {
			path: '/home/noticeManagement',
			component: NoticeManagement
		}, {
			path: '/home/noticeSingle/:name',
			component: NoticeSingle
		}, {
			path: '/home/personInfo',
			component: PersonInfo
		}]
	}]
})

router.beforeEach((to, from, next) => {
	iView.LoadingBar.start()
	if(to.path === '/') {
		next()
	} else {
		let path = to.path
		path = path.split('/')
		if(path[1] === 'noticeRead') {
			next()
			return
		}
		const User = getUserIng()
		if(User) {
			next()
			if(store.getters.User.username !== undefined) {
				return
			}
			store.commit('SET_USER', User)
		} else {
			next('/');
			iView.LoadingBar.finish()
		}
	}

})

router.afterEach((to, from, next) => {
	store.commit('SET_ROUTERFROM', from.path)
	iView.LoadingBar.finish()
})

export default router