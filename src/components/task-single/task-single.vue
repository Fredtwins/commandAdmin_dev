<template>
	<div class="task-single">
		<div class="task-single-warpper">
			<div class="title">
				<base-title title="工地管理"></base-title>
			</div>
			<div class="bread-menu">
				<Breadcrumb>
			        <BreadcrumbItem :href="breadHref">{{breadLabel}}</BreadcrumbItem>
			        <BreadcrumbItem>{{getTaskIng.name}}</BreadcrumbItem>
			    </Breadcrumb>
			</div>
			<div class="task-menu">
				<Tabs
					:animated="false" 
					v-model="tabActive">
			        <TabPane 
			        	v-for="item in tabs" 
			        	:label="item.label" 
			        	:name="item.name"></TabPane>
			       
			    </Tabs>
			</div>
			
			<div class="task-content">
				<component :name="name" :is="tabActive"></component>
			</div>
			
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import singleAttendance from 'components/task-single/tabs/single-attendance'
	import singleMission from 'components/task-single/tabs/sigle-mission'
	import singleDanger from 'components/task-single/tabs/single-danger'
	import singleAtlas from 'components/task-single/tabs/single-atlas'
	import singleTaskAtlas from 'components/task-single/tabs/single-TaskAtlas'
	import { baseTitleMixin } from 'common/js/mixins'
	import { taskSingleTabs } from 'common/js/module'
	import { getTaksIng } from 'common/js/util'
	
	export default {
		mixins: [baseTitleMixin],
		components: {
			'single-attendance': singleAttendance,
			'single-misson': singleMission,
			'single-danger': singleDanger,
			'single-atlas': singleAtlas,
			'single-taskAtlas': singleTaskAtlas
		},
		computed: {
			breadHref() {
				return this.RouterFrom === '/home/map' ? '/home/map' : '/home/taskManagement'
			},
			breadLabel() {
				return this.RouterFrom === '/home/map' ? '地图信息' : '工地管理'
			},
			getTaskIng() {
				return getTaksIng()
			},
			...mapGetters([
				'RouterFrom'
			])
		},
		created() {
			this.name = this.$route.params.name

			this.ifTrueInfo()
		},
		data() {
			return {
				tabs: taskSingleTabs,
				tabActive: 'single-attendance'
			}
		},
		methods: {
			ifTrueInfo() {
				if (this.name === this.getTaskIng.constructionid) {
					return 
				}
				this.$router.push(this.breadHref)
			}
		}
		
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');

	.task-single {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.task-single-warpper {
			width: 100%;
			min-height: 100%;
			padding: 10px;
			position: relative;
			background-color: white;
			.title {
				padding: 10px 0 20px;
			}
			.task-menu {
				margin-top: 10px;
			}
			.task-content {
				
			}
		}
	}
</style>