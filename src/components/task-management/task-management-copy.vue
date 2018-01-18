<template>
	<div class="task-management">
		<div class="task-management-warpper clear">
			<div class="title">
				<base-title title="工地管理"></base-title>
			</div>
			<div class="head clear">
				<div class="search pull-left">
					<span>工地片区</span>
					<Select 
						v-model="searchValue.area"
						placeholder="工地片区"
						:clearable="true"
						style="width:200px;padding-left: 10px;">
				        <Option value="东片区" key="东片区">东片区</Option>
				        <Option value="中片区" key="中片区">中片区</Option>
				        <Option value="西片区" key="西片区">西片区</Option>
				   	</Select>
					&nbsp;&nbsp;
					<span>工地状态</span>
					<Select 
						v-model="searchValue.state"
						placeholder="工地状态"
						:clearable="true"
						style="width:200px;padding-left: 10px;">
				        <Option value="已建" key="已建">已建</Option>
				        <Option value="在建" key="在建">在建</Option>
				        <Option value="规划中" key="规划中">规划中</Option>
				   	</Select>
					&nbsp;&nbsp;
					<span>工地名称</span>
					<Input v-model="searchValue.name" placeholder="工地名称" @on-enter="search(1)" style="width: 200px;padding-left: 10px;"></Input>
				</div>
				<div class="searchBtn pull-left" @click="search(1)">
					<Button type="ghost" shape="circle" icon="ios-search"></Button>
				</div>
				<div class="action pull-right" @click="add">
					<Button type="primary">新增工地</Button>
				</div>
			</div>
			<div class="table">
				<Table 
					border 
					stripe 
					highlight-row 
					size="small" 
					:columns="tableThead" 
					:data="tableTbody"
					@on-row-click="goDetail"></Table>
			</div>
			<div class="page pull-right">
				<Page :total="total" :current="current" show-elevator @on-change="pageChange"></Page>
			</div>
			<loading v-show="showLoading"></loading>
		</div>

		<interact-model 
			ref="action-model" 
			class="action-model" 
			:title="actionTitle" 
			:isCancel="true" 
			@cancel="actionCancel">
			<div class="action-content">
				<div class="action-warpper">
					<div class="action-map">
						<div class="action-map-detail" ref="action-map"></div>
					</div>
					<div class="action-formItems">
						<div class="formItems-warpper">
							<data-form 
								v-if="formData.length"
								ref="data-form" 
								:data="formData"
								:rules="rules"></data-form>
						</div>
						<div class="formItems-choseLocal" @click="actionChose">
							<Button type="primary">{{actionChoseTitle}}</Button>
						</div>
						<div class="formItems-commit" @click="actionCommit">
							<Button type="primary">保存</Button>
						</div>
					</div>
				</div>
				<loading v-show="actionLoading"></loading>
			</div>
		</interact-model>
		
		<warn-model 
			title="警告" 
			message="确定要删除这条记录？" 
			ref="del-warnModel"
			@sure="removeCommit"></warn-model>

	</div>
</template>

<script>
	import { baseTitleMixin, loadingMixin, interactModelMixin, dataFormMixin, warnModelMixin } from 'common/js/mixins'
	import { taskManagementThead } from 'common/js/table'
	import { taskManagementFormData } from 'common/js/module'
	import { taskManagementRules } from 'common/js/rules'
	import { cloneObj, fiterUserJob, setTaksIng } from 'common/js/util'
	import { errorNotice, successNotice } from 'common/js/dom'
	import { createMap, getLayer, singleSitesFeatures, singleSitesDrawSource } from 'api/map'
	import { ERR_OK, Static } from 'api/config'
	import { getTaskList, updateTaskList, getUserAll } from 'api/task-management'

	export default {
		mixins: [baseTitleMixin, loadingMixin, interactModelMixin, dataFormMixin, warnModelMixin],
		computed: {
			actionChoseTitle() {
				return this.isActionChose ? '取消选择' : '选取位置'
			}
		},
		created() {
			this._getUserAll()
			this._getTaskList()
			this.layers = {}
			this.Draw = null
			this.DrawSource = singleSitesDrawSource
			this.actionType = ''
			this.rowIng = {}
		},
		data() {
			return {
				searchValue: {
					area: '',
					state: '',
					name: ''
				},
				tableThead: taskManagementThead(this),
				tableTbody: [],
				total: 0,
				current: 1,
				showLoading: false,
				actionTitle: '',
				formData: [],
				rules: taskManagementRules,
				actionLoading: false,
				isActionChose: false
			}
		},
		methods: {
			goDetail(row) {
				setTaksIng(row)
				this.$router.push(`/home/taskSingle/${row.constructionid}`)
			},
			add() {
				this.actionTitle = '新增工地'
				this.actionType = 'save'
				this.$refs['data-form'].initFormItem()
				this.$refs['data-form'].clearValidate()
				this.$refs['action-model'].showModel()
				this.isNeedInitMap()
				this.initDraw()
			},
			edit(row) {
				this.actionTitle = '编辑工地'
				this.actionType = 'edit'
				this.rowIng = cloneObj(row)
				this.$refs['action-model'].showModel()
				
				row['local'] = `${row.lat},${row.lnt}`
				row['chiefsupervisor'] = row.chiefsupervisor.userid
				row['constructor_realname'] = row.constructor.userid
				row['inspector_realname'] = row.inspector.userid
				row['pm'] = row.pm.userid
				row['qualitysupervisor'] = row.qualitysupervisor.userid
				row['safor'] = row.safor.userid
				row['supervisor_realname'] = row.supervisor.userid
				row['technologyleader'] = row.technologyleader.userid
				this.$refs['data-form'].clearValidate()
				this.$refs['data-form'].setFormItems(row)
				
				this.isNeedInitMap()
				this.initDraw()
				
				this.drawTask(row)
			},
			actionCommit() {
				if (!this.$refs['data-form'].validate()) {
					return
				}
				this.showLoading = true
				
				let type = this.actionType
				let data = this.$refs['data-form'].getFormItem()
				let local = data.local.split(',')
				
				data.lat = local[0]
				data.lnt = local[1]
				data.constructor = data.constructor_realname
				data.inspector = data.inspector_realname
				data.supervisor = data.supervisor_realname
				
				delete data['local']
				delete data['constructor_realname']
				delete data['inspector_realname']
				delete data['supervisor_realname']
				
				updateTaskList(type, data).then(res => {
					if (res.code === ERR_OK) {
						this.search(1)
						this.$refs['action-model'].hideModel()
						successNotice('操作成功')
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			actionChose() {
				this.isActionChose = !this.isActionChose
				if (this.isActionChose) {
					this.Draw.setActive(true);
				}else {
					this.Draw.setActive(false);
				}
			},
			actionCancel() {
				if (this.isActionChose) {
					this.actionChose()
				}
			},
			remove(row) {
				this.rowIng = cloneObj(row)
				this.$refs['del-warnModel'].showModel()
			},
			removeCommit() {
				this.showLoading = true
				this.$refs['del-warnModel'].hideModel()
				let type = 'del'
				let data = {
					_ids: this.rowIng._id
				}
				
				updateTaskList(type, data).then(res => {
					if (res.code === ERR_OK) {
						this.search(1)
						successNotice('操作成功')
					}else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			search(page) {
				let search = {}
				for(let key in this.searchValue) {
					if (this.searchValue[key]) {
						search[key] = this.searchValue[key]
					}
				}
				this._getTaskList(page, search)
			},
			pageChange(page) {
				this.search(page)
			},
			isNeedInitMap() {
				if(this.layers.Map) {
					return
				}
				setTimeout(() => {
					this.initMap()
				}, 20)
			},
			drawTask(row) {
				this.DrawSource.addFeature(singleSitesFeatures(row)[0])
			},
			initDraw() {
				if (this.layers.draw_layer) {
					this.DrawSource.clear()
				}
			},
			initMap() {
				this.layers.heightLayer = getLayer('heightLayer')
				this.layers.FsNhLayer = getLayer('FsNhLayer')
				this.layers.notionLayer = getLayer('notionLayer')

				this.layers.heightLayer.setVisible(true)

				this.layers.Map = createMap(this.$refs['action-map'], [this.layers.heightLayer, this.layers.FsNhLayer, this.layers.notionLayer])
				
				this.layers.draw_layer = new ol.layer.Vector({
					source: this.DrawSource,
					style: [new ol.style.Style({
						image: new ol.style.Icon(({
							src: `${Static}img/mapIcon/patrolMission.png`,
							scale: 0.7
						}))
					})],
					name: 'Draw'
				})

				this.initMapClick()
				
				this.initMapDraw()
			},
			initMapClick() {
				this.layers.Map.on('singleclick', (event) => {

					let pixel = event.pixel
					let lng = event.coordinate[0]
					let lat = event.coordinate[1]
					let features = []
					let layerNames = []

					this._getTaskPlace(lng, lat)
				})
			},
			initMapDraw() {
				
				this.layers.Map.addLayer(this.layers.draw_layer)
				
				let that = this

				this.Draw = {
					init: function() {
						that.layers.Map.addInteraction(this.Point)
						this.Point.setActive(false)
						this.Point.on('drawstart', function(event) {
							that.DrawSource.clear()
						})
						this.Point.on('drawend', function(event) {
//							that.actionChose()
						})
					},
					Point: new ol.interaction.Draw({
						source: this.DrawSource,
						type: /** @type {ol.geom.GeometryType} */ ('Point')
					}),
					getActive: function() {
						return this.activeType ? this[this.activeType].getActive() : false
					},
					setActive: function(active) {
						var type = 'Point';
						if(active) {
							this.activeType && this[this.activeType].setActive(false)
							this[type].setActive(true)
							this.activeType = type
						} else {
							this.activeType && this[this.activeType].setActive(false)
							this.activeType = null
						}
					}
				}
				
				this.Draw.init()
			},
			_getTaskPlace(lnt, lat) {
				if (!this.isActionChose) {
					return
				}
				
				this.actionLoading = true

				this.$refs['data-form'].setFormItem('local', `${lat},${lnt}`)
				
				var geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				})
				geocoder.getAddress([lnt, lat], (status, result) => {
					if(status === 'complete' && result.info === 'OK') {
						if(result && result.regeocode) {
							this.$refs['data-form'].setFormItem('address', result.regeocode.formattedAddress)
							this.actionLoading = false
						}
					}
				})
			},
			_getTaskList(page, search) {
				this.showLoading = true
				getTaskList(page, search).then(res => {
					if(res.code === ERR_OK) {
						this.tableTbody = res.result.result
						this.total = res.result.totalSize
						this.current = res.result.page
					} else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			_getUserAll() {
				getUserAll().then(res => {
					if(res.code === ERR_OK) {
						let data = cloneObj(taskManagementFormData)
						this.formData = fiterUserJob(res, data)
					} else {
						errorNotice()
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');
	.task-management {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		overflow: auto;
		.task-management-warpper {
			width: 100%;
			min-height: 100%;
			padding: 10px;
			position: relative;
			background-color: white;
			.title {
				padding: 10px 0 20px;
			}
			.head {
				width: 100%;
				font-size: 14px;
				.searchBtn {
					margin-left: 10px;
				}
			}
			.table {
				width: 100%;
				margin-top: 10px;
			}
			.page {
				margin-top: 20px;
			}
		}
		.action-model {
			width: 900px;
			height: 550px;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			.action-content {
				width: 100%;
				height: 100%;
				padding: 5px;
				.action-warpper {
					width: 100%;
					height: 100%;
					position: relative;
					.action-map {
						position: absolute;
						left: 0;
						right: 40%;
						top: 0;
						bottom: 0;
						.action-map-detail {
							width: 100%;
							height: 100%;
						}
					}
					.action-formItems {
						position: absolute;
						left: 61%;
						right: 0;
						top: 0;
						bottom: 0;
						.formItems-warpper {
							width: 100%;
							overflow: auto;
							position: absolute;
							top: 0;
							bottom: 50px;
						}
						.formItems-choseLocal {
							position: absolute;
							bottom: 10px;
							right: 70px;
						}
						.formItems-commit {
							position: absolute;
							bottom: 10px;
							right: 10px;
						}
					}
				}
			}
		}
	}
</style>