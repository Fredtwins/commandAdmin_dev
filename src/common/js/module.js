import { Static } from 'api/config'

export function dangerManagementSteps() {
	return [{
		title: '已完成',
		content: '发现隐患',
		status: 'finish'
	}, {
		title: '待进行',
		content: '监理已读'
	}, {
		title: '待进行',
		content: '施工方已读'
	}, {
		title: '待进行',
		content: '已整改'
	}, {
		title: '待进行',
		content: '已完成（监理审核）'
	}]
}

export function fnReadData() {
	return [{
		title: '已建',
		img: `${Static}img/mapInfo/site.png`,
		layerName: 'site',
		checked: true
	}, {
		title: '在建',
		img: `${Static}img/mapInfo/siting.png`,
		layerName: 'siting',
		checked: true
	}, {
		title: '规划中',
		img: `${Static}img/mapInfo/noSite.png`,
		layerName: 'noSite',
		checked: true
	}, {
		title: '巡查轨迹',
		img: `${Static}img/mapInfo/patrolMission.png`,
		layerName: 'patrolMissionLayer',
		checked: false
	}]
}

export const patrolExpandSafeData = [{
	key: '常规项目',
	data: [{
		key: '监理人员到位'
	}, {
		key: '施工人员到位'
	}, {
		key: '资料同步情况'
	}, {
		key: '贯彻落实上级相关部门安全生产的工作部署及时令性要求'
	}, {
		key: '健全安全生产宣传教育制度'
	}, {
		key: '健全安全生产宣传检查制度'
	}, {
		key: '定期召开安全生产会议'
	}, {
		key: '安全生产设施'
	}, {
		key: '安全生产管理人员、特种人员持证上岗'
	}, {
		key: '应急预案编制及演练'
	}, {
		key: '安全资料报送、收集、归档情况'
	}, {
		key: '及时进行安全隐患整改'
	}, {
		key: '工人工资支付公示情况'
	}]
}, {
	key: '施工现场',
	data: [{
		key: '现场布置、防扬尘措施'
	}, {
		key: '施工道路及交通'
	}, {
		key: '职业卫生与环境保护'
	}, {
		key: '消防'
	}, {
		key: '季节施工'
	}, {
		key: '防汛'
	}, {
		key: '施工排水'
	}, {
		key: '文明施工'
	}, {
		key: '现场保卫'
	}]
}, {
	key: '施工风、水、电及通讯',
	data: [{
		key: '接地、变压器或配电室'
	}, {
		key: '线路敷设'
	}, {
		key: '施工供水'
	}, {
		key: '施工供风'
	}, {
		key: '施工通信'
	}, {
		key: '安全用电方案'
	}]
}, {
	key: '安全防护设施',
	data: [{
		key: '高处作业'
	}, {
		key: '施工脚手架'
	}, {
		key: '施工走道栈桥与梯子'
	}, {
		key: '安全防护用具'
	}, {
		key: '特种设备管理'
	}, {
		key: '起重与运输管理'
	}]
}, {
	key: '焊接与气割、危险品管理',
	data: [{
		key: '焊接场地与设备'
	}, {
		key: '焊条电弧焊、埋弧焊'
	}, {
		key: '气焊与气割'
	}, {
		key: '易燃物品'
	}, {
		key: '有毒有害物品'
	}, {
		key: '油品（库）管理'
	}]
}]

export const patrolExpandWeightData = [{
	key: '土方',
	data: [{
		key: '分层压实'
	}, {
		key: '回填不带水'
	}, {
		key: '回填速率符合设计要求和规范规定'
	}, {
		key: '土方质评资料'
	}]
}, {
	key: '钢砼',
	data: [{
		key: '施工队“三检”制度'
	}, {
		key: '原材料、中间产品见证送检'
	}, {
		key: '混泥土的配合比、拌合物的质量、配料计量偏差符合规范规定'
	}, {
		key: '钢筋的安装质量，钢筋的品种、规格、质量和钢筋的根数符合设计要求，同一截面受力钢筋接头的数量和绑扎接头的搭接长度符合规范规定'
	}, {
		key: '基坑排水措施到位'
	}, {
		key: '砼的自然养护条件'
	}, {
		key: '模板具有足够稳定性、刚度和强度，拼缝严密'
	}, {
		key: '砼表面无蜂窝、麻面现象'
	}, {
		key: '钢砼质评资料'
	}]
}, {
	key: '砌体',
	data: [{
		key: '料石、块石的质量、规格符合设计要求和规范规定'
	}, {
		key: '砌体的砌筑质量，砌体相互错缝，坐实挤紧，空隙嵌实'
	}, {
		key: '浆砌石的砌筑砂浆饱满密实'
	}, {
		key: '砌体质评资料'
	}]
}, {
	key: '金属结构、机电设备及安装工程',
	data: [{
		key: '制造单位的生产许可证或认证证书'
	}, {
		key: '设备进场验收记录'
	}, {
		key: '金属结构、机电设备及安装工程质评资料'
	}]
}]

export const patrolExpandProgessData = [{
	key: '进度检查',
	data: [{
		key: '节点工期实施情况'
	}, {
		key: '重要部位实施情况防洪度汛实施情况'
	}, {
		key: '形象进度'
	}]
}]

export const taskManagementFormData = [{
		label: '工地名称',
		key: 'name',
		type: 'text',
		size: 'default'
	}, {
		label: '工地地址',
		key: 'address',
		type: 'text',
		size: 'default'
	}, {
		label: '坐标',
		key: 'local',
		type: 'text',
		size: 'default'
	}, {
		label: '片区',
		key: 'area',
		type: 'select',
		data: [{
			label: '东片区',
			value: '东片区'
		}, {
			label: '中片区',
			value: '中片区'
		}, {
			label: '西片区',
			value: '西片区'
		}],
		size: 'default'
	}, {
		label: '状态',
		key: 'state',
		type: 'select',
		val: '在建',
		data: [{
			label: '已建',
			value: '已建'
		}, {
			label: '在建',
			value: '在建'
		}, {
			label: '规划中',
			value: '规划中'
		}],
		size: 'default'
	}, {
		label: '开工时间',
		key: 'start_time',
		type: 'date',
		size: 'default'
	}, {
		label: '完工时间',
		key: 'end_time',
		type: 'date',
		size: 'default'
	}, {
		label: '巡查员',
		key: 'inspector_realname',
		type: 'select',
		size: 'default',
		place: 'top'
	}, {
		label: '施工单位',
		key: 'construction_institution',
		type: 'select',
		size: 'default',
		place: 'top'
	}, {
		label: '监理单位',
		key: 'supervisor_institution',
		type: 'select',
		size: 'default',
		place: 'top'
	}
	//, {
	//	label: '施工员',
	//	key: 'constructor_realname',
	//	type: 'select',
	//	size: 'default'
	//},{
	//	label: '质监员',
	//	key: 'qualitysupervisor',
	//	type: 'select',
	//	size: 'default'
	//}, {
	//	label: '安全员',
	//	key: 'safor',
	//	type: 'select',
	//	size: 'default'
	//}, {
	//	label: '技术负责人',
	//	key: 'technologyleader',
	//	type: 'select',
	//	size: 'default'
	//}, {
	//	label: '项目经理',
	//	key: 'pm',
	//	type: 'select',
	//	size: 'default'
	//}, {
	//	label: '监理员',
	//	key: 'supervisor_realname',
	//	type: 'select',
	//	size: 'default'
	//}, {
	//	label: '总监理',
	//	key: 'chiefsupervisor',
	//	type: 'select',
	//	size: 'default'
	//}
]

export const userManagementWork = [{
	value: '管理员',
	label: '管理员'
}, {
	value: '巡查员',
	label: '巡查员'
}, {
	value: '施工方',
	label: '施工方',
	children: [{
		value: '施工员',
		label: '施工员'
	}, {
		value: '安全员',
		label: '安全员'
	}, {
		value: '质监员',
		label: '质监员'
	}, {
		value: '技术负责人',
		label: '技术负责人'
	}, {
		value: '项目经理',
		label: '项目经理'
	}]
}, {
	value: '监理方',
	label: '监理方',
	children: [{
		value: '监理员',
		label: '监理员'
	}, {
		value: '总监理',
		label: '总监理'
	}]
}]

export function userManagementFormData(str) {
	let size = str || 'small'
	return [{
		label: '用户属性',
		key: 'work',
		type: 'cascader',
		data: [{
			value: '管理员',
			label: '管理员'
		}, {
			value: '巡查员',
			label: '巡查员'
		}, {
			value: '施工方',
			label: '施工方',
			children: [{
				value: '施工员',
				label: '施工员'
			}, {
				value: '安全员',
				label: '安全员'
			}, {
				value: '质监员',
				label: '质监员'
			}, {
				value: '技术负责人',
				label: '技术负责人'
			}, {
				value: '项目经理',
				label: '项目经理'
			}]
		}, {
			value: '监理方',
			label: '监理方',
			children: [{
				value: '监理员',
				label: '监理员'
			}, {
				value: '总监理',
				label: '总监理'
			}]
		}],
		size: size
	}, {
		label: '所在单位',
		key: 'institution',
		type: 'select',
		size: size
	}, {
		label: '用户名称',
		key: 'username',
		type: 'text',
		size: size
	}, {
		label: '真实姓名',
		key: 'realname',
		type: 'text',
		size: size
	}, {
		label: '用户电话',
		key: 'phone',
		type: 'text',
		size: size
	}, {
		label: '身份证',
		key: 'identification',
		type: 'text',
		size: size
	}]
	//	{
	//		label: '用户属性',
	//		key: 'job',
	//		place: 'top',
	//		type: 'select',
	//		data: [{
	//			value: '巡查员',
	//			label: '巡查员'
	//		}, {
	//			value: '安全员',
	//			label: '安全员'
	//		}, {
	//			value: '施工员',
	//			label: '施工员'
	//		}, {
	//			value: '质监员',
	//			label: '质监员'
	//		}, {
	//			value: '监理员',
	//			label: '监理员'
	//		}, {
	//			value: '项目经理',
	//			label: '项目经理'
	//		}, {
	//			value: '总监理',
	//			label: '总监理'
	//		}, {
	//			value: '技术负责人',
	//			label: '技术负责人'
	//		}],
	//		size: size
	//	},

}

export const taskSingleTabs = [{
	label: (h) => {
		return h('div', [
			h('span', {
				class: {
					'iconfont': true,
					'icon-kaoqin': true
				},
				style: {
					marginRight: '5px'
				}
			}),
			h('span', '考勤记录')
		])
	},
	name: 'single-attendance'
}, {
	label: (h) => {
		return h('div', [
			h('span', {
				class: {
					'iconfont': true,
					'icon-xunchajiancha': true
				},
				style: {
					marginRight: '5px',
					fontSize: '14px'
				}
			}),
			h('span', '巡查记录')
		])
	},
	name: 'single-misson'
}, {
	label: (h) => {
		return h('div', [
			h('span', {
				class: {
					'iconfont': true,
					'icon-fengxianbaozhang': true
				},
				style: {
					marginRight: '5px',
					fontSize: '14px'
				}
			}),
			h('span', '隐患记录')
		])
	},
	name: 'single-danger'
}, {
	label: (h) => {
		return h('div', [
			h('span', {
				class: {
					'iconfont': true,
					'icon-tuce': true
				},
				style: {
					marginRight: '5px',
					fontSize: '14px'
				}
			}),
			h('span', '巡查图册')
		])
	},
	name: 'single-atlas'
}, {
	label: (h) => {
		return h('div', [
			h('span', {
				class: {
					'iconfont': true,
					'icon-tuce1': true
				},
				style: {
					marginRight: '5px',
					fontSize: '14px'
				}
			}),
			h('span', '工地图册')
		])
	},
	name: 'single-taskAtlas'
}]

function createCalendarData() {
	let month = new Date().getMonth() + 1
	let activeYear = []
	for(let i = 1; i <= month; i++) {
		let index = i
		if(index < 10) {
			index = `0${index}`
		}
		activeYear.push({
			value: index,
			label: index
		})
	}
	let months = [];
	for(let i = 1; i <= 12; i++) {
		let index = i
		if(index < 10) {
			index = `0${index}`
		}
		months.push({
			value: index,
			label: index
		})
	}
	let year = new Date().getFullYear()
	let years = [];
	for(let i = 0; i < 10; i++) {
		if(i === 0) {
			years.push({
				value: parseInt(year) - i,
				label: parseInt(year) - i,
				children: activeYear
			})
		} else {
			years.push({
				value: parseInt(year) - i,
				label: parseInt(year) - i,
				children: months
			})
		}
	}
	return years;
}

export const calendarData = createCalendarData()