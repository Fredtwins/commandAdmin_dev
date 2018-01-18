<template>
	<div class="task-action">
		<div class="task-action-warpper">
			<div class="title">
				<base-title title="工地管理"></base-title>
			</div>
			<div class="bread-menu">
				<Breadcrumb>
					<BreadcrumbItem href="/home/taskManagement">工地管理</BreadcrumbItem>
					<BreadcrumbItem>操作</BreadcrumbItem>
				</Breadcrumb>
			</div>
			<div class="task-action-content">
				<div class="task-action-map" v-if="formData.length">
					<el-amap-search-box ref="amap-search" class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
					<el-amap ref="map" vid="amapDemo" :plugin="plugin" :center="center" :zoom="zoom" class="amap-demo">
						<el-amap-polygon v-for="item in mapArea" :path="item" strokeWeight="5" fillOpacity="0" fillColor="#CCF3FF" strokeColor="#CC66CC"></el-amap-polygon>
						<el-amap-polygon v-if="drawPolygons.path.length" :editable="drawPolygons.editable" :strokeColor="drawPolygons.strokeColor" :fillColor="drawPolygons.fillColor" :fillOpacity="drawPolygons.fillOpacity" :path="drawPolygons.path"></el-amap-polygon>
						<el-amap-marker v-for="marker in searchMarkers" :position="marker"></el-amap-marker>
						<el-amap-marker v-if="drawMarkers.pos.length" :position="drawMarkers.pos" :icon="drawMarkers.icon" :draggable="drawMarkers.drag" :events="drawMarkers.events" :zIndex="drawMarkers.zIndex"></el-amap-marker>
					</el-amap>
				</div>
				<div class="task-action-form" v-if="formData.length">
					<div class="formItems-warpper">
						<div class="formItems-form">
							<data-form ref="data-form" :data="formData" :rules="rules" @selectChange="selectChange"></data-form>
						</div>
						<div class="formItems-institution">
							<div class="formItems-detail">
								<div class="formItems-title">
									施工单位人员列表
								</div>
								<div class="formItems-list-warpper">
									<ul v-show="constructorList" class="list-datas">
										<li v-for="(items, key) in constructorList" class="list-data">
											<div class="list-title">{{key}}</div>
											<div class="list-infos">
												<RadioGroup v-model="formItem[key]">
													<Radio v-for="item in items" :label="item.userid" @click.prevent.native="radioClick(key, item.userid)">
														<span>{{item.realname}}</span>
													</Radio>
												</RadioGroup>
											</div>
										</li>
									</ul>
									<div v-show="!constructorList" class="list-noData">请先选择施工单位</div>
								</div>
							</div>
							<div class="formItems-detail">
								<div class="formItems-title">
									监理单位人员列表
								</div>
								<div class="formItems-list-warpper">
									<ul v-show="supervisorList" class="list-datas">
										<li v-for="(items, key) in supervisorList" class="list-data">
											<div class="list-title">{{key}}</div>
											<div class="list-infos">
												<RadioGroup v-model="formItem[key]">
													<Radio v-for="item in items" :label="item.userid" @click.prevent.native="radioClick(key, item.userid)">
														<span>{{item.realname}}</span>
													</Radio>
												</RadioGroup>
											</div>
										</li>
									</ul>
									<div v-show="!supervisorList" class="list-noData">请先选择监理单位</div>
								</div>
							</div>
						</div>
					</div>
					<div class="formItems-drwaPolygon" @click="drawPolygonClick">
						<Button type="primary">{{drawPolygonTitle}}</Button>
					</div>
					<div class="formItems-addUser" @click="addUser">
						<Button type="primary">新增用户</Button>
					</div>
					<div class="formItems-commit" @click="actionCommit">
						<Button type="primary">保存</Button>
					</div>
				</div>
			</div>
		</div>

		<interact-model ref="action-model" class="action-model" title="新增用户">
			<div class="action-content">
				<div class="action-warpper">
					<div class="action-formItems">
						<div class="formItems-warpper">
							<user-form ref="user-data-form"></user-form>
						</div>
						<div class="formItems-commit" @click="addUserCommit">
							<Button type="primary">保存</Button>
						</div>
					</div>
				</div>
			</div>
		</interact-model>

		<loading v-show="showLoading"></loading>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'
	import userForm from 'base/user-form/user-form'
	import { baseTitleMixin, interactModelMixin, loadingMixin, dataFormMixin } from 'common/js/mixins'
	import { taskManagementFormData, userManagementFormData } from 'common/js/module'
	import { taskManagementRules, userManagementRules } from 'common/js/rules'
	import { cloneObj, fiterConstruct, fiterSupervisor, fiterJob, filterCoordinate } from 'common/js/util'
	import { errorNotice, successNotice, errorMessage } from 'common/js/dom'
	import { ERR_OK, Static } from 'api/config'
	import { editTask, updateTaskList, getFormData } from 'api/task-management'
	import { updateUserList } from 'api/user-management'
	
	const center = [113.0445, 23.0607]
	const address = '广东省佛山市南海区狮山镇创业东路'

	export default {
		mixins: [baseTitleMixin, interactModelMixin, loadingMixin, dataFormMixin],
		components: {
			'user-form': userForm
		},
		computed: {
			actionType() {
				return this.$route.params.name === 'add' ? 'save' : 'edit'
			},
			drawPolygonTitle() {
				return !this.isDrawPolygon ? '绘制区域' : '取消绘制'
			}
		},
		created() {
			this.userAll = []
			this.routerUrl = this.$route.params.name.split('_')
		},
		mounted() {
			setTimeout(() => {
				this.initEdit()
			}, 20)
		},
		data() {
			return {
				plugin: [{
					pName: 'MapType',
					defaultType: 0
				}],
				center: cloneObj(center),
				zoom: 11,
				searchOption: {
					city: '佛山',
					citylimit: true
				},
				searchMarkers: [],
				mapArea: [],
				drawMarkers: {
					pos: cloneObj(center),
					icon: `${Static}img/mapIcon/draw.png`,
					drag: true,
					zIndex: 9999,
					events: {
						'dragging': (e) => {
							let lng = e.lnglat.lng
							let lat = e.lnglat.lat
							this.$refs['data-form'].setFormItem('local', `${lat},${lng}`)
						},
						'dragend': (e) => {
							let lng = e.lnglat.lng
							let lat = e.lnglat.lat
							this._getAddress([lng, lat])
						}
					}
				},
				drawPolygons: {
					editable: true,
					strokeColor: '#008cee',
					fillColor: 'white',
					fillOpacity: 0.7,
					path: []
				},
				circles: [],
				formData: [],
				rules: taskManagementRules,
				showLoading: false,
				isDrawPolygon: false,
				formItem: {
					'施工员': '',
					'质监员': '',
					'安全员': '',
					'技术负责人': '',
					'项目经理': '',
					'监理员': '',
					'总监理': ''
				},
				constructorList: null,
				supervisorList: null
			}
		},
		methods: {
			radioClick(key, id) {
				if(this.formItem[key] === id) {
					this.formItem[key] = ''
				} else {
					this.formItem[key] = id
				}
			},
			selectChange(obj) {
				let arr = []
				this.userAll.map(item => {
					if(item.institution === obj.val) {
						arr.push(item)
					}
				})

				if(obj.key === 'construction_institution') {
					if(!arr.length) {
						this.constructorList = null
						return
					}
					this.constructorList = fiterConstruct(arr)
				} else if(obj.key === 'supervisor_institution') {
					if(!arr.length) {
						this.supervisorList = null
						return
					}
					this.supervisorList = fiterSupervisor(arr)
				}
			},
			pushOgn() {
				if(this.$refs['data-form'].formItem['construction_institution']) {
					this.selectChange({
						key: 'construction_institution',
						val: this.$refs['data-form'].formItem['construction_institution']
					})
				}
				if(this.$refs['data-form'].formItem['supervisor_institution']) {
					this.selectChange({
						key: 'supervisor_institution',
						val: this.$refs['data-form'].formItem['supervisor_institution']
					})
				}
			},
			drawPolygonClick() {
				this.isDrawPolygon = !this.isDrawPolygon
				if(this.isDrawPolygon) {
					this.mouseTool.polygon()
				} else {
					this.mouseTool.close(true)
				}
			},
			drawPolygon(arr) {
				let path = cloneObj(arr)
				this.drawPolygons.path = filterCoordinate(path)
			},
			addUser() {
				this.$refs['user-data-form'].initFormItem()
				this.$refs['user-data-form'].clearValidate()
				this.$refs['action-model'].showModel()
			},
			addUserCommit() {
				if(!this.$refs['user-data-form'].validate()) {
					return
				}
				this.showLoading = true
				let data = this.$refs['user-data-form'].getFormItem()
				data['password'] = '123456'

				data.phone = data.username
				data.role = data.work[0]
				data.job = data.work[1] || data.work[0]
				delete data['work']

				updateUserList('save', data).then(res => {
					if(res.code === ERR_OK) {
						this.$refs['action-model'].hideModel()
						this.userAll.push(res.result)
						this.pushOgn()
						this._getFormData()
						successNotice('操作成功')
					} else {
						errorNotice(res.message, true)
					}
					this.showLoading = false
				})
			},
			actionCommit() {
				if(!this.$refs['data-form'].validate()) {
					return
				}

				let drawPath = filterCoordinate(this.drawPolygons.path)

				if(!drawPath.length) {
					errorMessage('请先绘制工地区域。')
					return
				}

				this.showLoading = true

				let type = this.actionType
				let data = cloneObj(this.$refs['data-form'].getFormItem())
				let local = data.local.split(',')

				data.lat = local[0]
				data.lnt = local[1]
				data.coordinate = drawPath
				data.inspector = data.inspector_realname
				data.constructor = this.formItem['施工员'] || ''
				data.qualitysupervisor = this.formItem['质监员'] || ''
				data.safor = this.formItem['安全员'] || ''
				data.technologyleader = this.formItem['技术负责人'] || ''
				data.pm = this.formItem['项目经理'] || ''
				data.supervisor = this.formItem['监理员'] || ''
				data.chiefsupervisor = this.formItem['总监理'] || ''

				delete data['_id']
				delete data['local']
				delete data['inspector_realname']

				updateTaskList(type, data).then(res => {
					if(res.code === ERR_OK) {
						if(this.actionType === 'save') {
							this.$refs['data-form'].initFormItem()
							this.$refs['data-form'].clearValidate()
							this.initLocal()
							this.center = cloneObj(center)
							this.drawMarkers.pos = cloneObj(center)
							this.drawPolygons.path = []
						}
						successNotice('操作成功')
					} else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			onSearchResult(pois) {
				if(this.$refs['amap-search'].keyword === '') {
					this.searchMarkers = []
					return
				}
				let latSum = 0
				let lngSum = 0
				this.searchMarkers = []
				if(pois.length > 0) {
					pois.forEach(poi => {
						let {
							lng,
							lat
						} = poi;
						lngSum += lng;
						latSum += lat;
						this.searchMarkers.push([poi.lng, poi.lat])
					})
					let center = {
						lng: lngSum / pois.length,
						lat: latSum / pois.length
					}
					this.center = [center.lng, center.lat]
					this.drawMarkers.pos = cloneObj(this.searchMarkers[0])
				} else {
					this.center = cloneObj(center)
					this.drawMarkers.pos = cloneObj(center)
				}
			},
			initLocal() {
				this.$refs['data-form'].setFormItem('local', `${center[1]},${center[0]}`)
				this.$refs['data-form'].setFormItem('address', address)
				if(this.routerUrl[0] === 'add') {
					this.$refs['data-form'].setFormItem('state', '在建')
				}

				this.initDraw()
			},
			initGeo() {
				this.geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				})
				let opts = {
	                subdistrict: 1,   
	                extensions: 'all',  
	                level: 'city'  
	            }
				let district = new AMap.DistrictSearch(opts)
				district.setLevel('district')
				
	            district.search('南海区',(status, result) => {
	                let bounds = result.districtList[0].boundaries
	                this.mapArea = bounds
	            })
			},
			initDraw() {
				this.mouseTool = new AMap.MouseTool(this.$refs.map.$$getInstance())

				this.mouseTool.on('draw', (obj) => {
					this.drawPolygon(obj.obj.G.path)
					this.drawPolygonClick()
				})
			},
			initFormData(obj) {
				let res1 = obj.res1
				let res2 = obj.res2

				this.userAll = cloneObj(res1.result.result)

				let data = cloneObj(taskManagementFormData)
				let inspectorIndex = data.findIndex(item => item.key === 'inspector_realname')
				let makeIndex = data.findIndex(item => item.key === 'construction_institution')
				let readIndex = data.findIndex(item => item.key === 'supervisor_institution')
				let inspectorData = []
				let makeData = []
				let readData = []
				res1.result.result.map(item => {
					if(item.role === '巡查员') {
						inspectorData.push({
							label: `${item.realname} - ${item.institution}`,
							value: item.userid
						})
					}
				})
				res2.result.map(item => {
					if(item.role === '施工方') {
						makeData.push({
							label: item.institution,
							value: item.institution
						})
					} else if(item.role === '监理方') {
						readData.push({
							label: item.institution,
							value: item.institution
						})
					}
				})

				data[inspectorIndex]['data'] = inspectorData
				data[makeIndex]['data'] = makeData
				data[readIndex]['data'] = readData
				return data
			},
			initEdit() {
				if(this.routerUrl[0] === 'add') {
					this.initGeo()

					this._getFormData()
					return
				}

				if(this.routerUrl[0] === 'edit') {
					this.initGeo()

					let name = this.routerUrl[1]
					let search = {
						constructionid: name
					}

					this._editTask(search)
					return
				}

				this.$router.push('/home/taskManagement')
			},
			_getAddress(pox) {
				this.showLoading = true
				this.geocoder.getAddress(pox, (status, result) => {
					if(status === 'complete' && result.info === 'OK') {
						if(result && result.regeocode) {
							this.$refs['data-form'].setFormItem('address', result.regeocode.formattedAddress)
							this.showLoading = false
						}
					}
				})
			},
			_getFormData() {
				this.showLoading = true
				getFormData().then(res => {
					let res1 = res[0].data
					let res2 = res[1].data
					if(res1.code === ERR_OK && res2.code === ERR_OK) {
						this.formData = this.initFormData({
							res1,
							res2
						})
						setTimeout(() => {
							this.SET_INSTITUTION(res2.result)
							this.initLocal()
						}, 20)
					} else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			_editTask(search) {
				this.showLoading = true
				editTask(search).then(res => {
					let res1 = res[0].data
					let res2 = res[1].data
					let res3 = res[2].data
					if(res1.code === ERR_OK && res2.code === ERR_OK && res3.code === ERR_OK) {
						if(res3.result.result.length) {
							this.formData = this.initFormData({
								res1,
								res2
							})
							this.SET_INSTITUTION(res2.result)
							setTimeout(() => {
								this.initLocal()

								let row = res3.result.result[0]

								row['local'] = `${row.lat},${row.lnt}`
								row['inspector_realname'] = row.inspector.userid

								this.$refs['data-form'].setFormItems(row)

								this.formItem['施工员'] = row.constructor.userid || ''
								this.formItem['质监员'] = row.qualitysupervisor.userid || ''
								this.formItem['安全员'] = row.safor.userid || ''
								this.formItem['技术负责人'] = row.technologyleader.userid || ''
								this.formItem['项目经理'] = row.pm.userid || ''
								this.formItem['监理员'] = row.supervisor.userid || ''
								this.formItem['总监理'] = row.chiefsupervisor.userid || ''

								this.center = [row.lnt, row.lat]
								this.drawMarkers.pos = [row.lnt, row.lat]
								this.drawPolygons.path = row.coordinate
							}, 20)
						} else {
							this.$router.push('/home/taskManagement')
						}
					} else {
						errorNotice()
					}
					this.showLoading = false
				})
			},
			...mapMutations([
				'SET_INSTITUTION'
			])

		}
	}
</script>

<style scoped lang="less">
	@import url('~common/less/color');
	.task-action {
		width: 100%;
		height: 100%;
		background-color: @bgColor-default;
		padding: 15px;
		.task-action-warpper {
			width: 100%;
			min-height: 100%;
			padding: 10px;
			position: relative;
			background-color: white;
			.title {
				padding: 10px 0 20px;
			}
			.task-action-content {
				position: absolute;
				left: 10px;
				right: 10px;
				top: 111px;
				bottom: 10px;
				.task-action-map {
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					right: 350px;
					.search-box {
						width: 250px;
						height: 32px;
						font-size: 14px;
						position: absolute;
						top: 25px;
						left: 20px;
					}
				}
				.task-action-form {
					width: 350px;
					position: absolute;
					top: 0;
					bottom: 0;
					right: 0;
					.formItems-warpper {
						padding-right: 10px;
						position: absolute;
						top: 0;
						bottom: 52px;
						left: 0;
						right: 0;
						overflow: auto;
						.formItems-institution {
							position: absolute;
							left: 0;
							right: 0;
							top: 490px;
							display: flex;
							font-size: 12px;
							.formItems-detail {
								flex: 1;
								padding-left: 10px;
								.formItems-title {}
								.formItems-list-warpper {
									user-select: none;
									border: 1px solid lightgray;
									border-radius: 5px;
									.list-datas {
										.list-data {
											margin-bottom: 10px;
											.list-title {
												padding-left: 5px;
											}
											.list-infos {
												padding-left: 10px;
												.list-info {}
											}
										}
									}
									.list-noData {
										text-align: center;
									}
								}
							}
						}
					}
					.formItems-drwaPolygon {
						position: absolute;
						bottom: 10px;
						right: 154px;
					}
					.formItems-addUser {
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
		.action-model {
			width: 480px;
			height: 350px;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			.action-content {
				width: 300px;
				padding-top: 20px;
				margin: auto;
				.action-warpper {
					width: 100%;
					.action-formItems {
						width: 100%;
						.formItems-warpper {
							width: 100%;
							position: relative;
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