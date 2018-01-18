/* 页面 table的thead
 * @ 劳兆城 
 * @ 2017-08-30*/

import { CancelBubble } from 'common/js/dom'
import { cloneObj } from 'common/js/util'
import { likeSearchRule } from 'common/js/config'
import { httpUrl } from 'api/config'

//工地管理
export function taskManagementThead(that) {
	return [{
		title: '工地名称',
		render: (h, params) => {
			let str = params.row.name
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '工地地址',
		render: (h, params) => {
			let str = params.row.address
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '片区',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.area
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '状态',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.state
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '巡查员',
		align: 'center',
		width: 110,
		render: (h, params) => {
			let str = params.row.inspector.realname
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '施工单位',
		render: (h, params) => {
			let str = params.row.construction_institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '监理单位',
		key: 'name',
		render: (h, params) => {
			let str = params.row.supervisor_institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '操作',
		key: 'action',
		width: 130,
		align: 'center',
		render: (h, params) => {
			return h('div', [
				h('Button', {
					props: {
						type: 'primary',
						size: 'small'
					},
					style: {
						marginRight: '5px'
					},
					on: {
						click: (e) => {
							let data = cloneObj(params.row)
							delete data['_index']
							delete data['_rowKey']
							that.edit(data)
							CancelBubble(e)
						}
					}
				}, '编辑'),
				h('Button', {
					props: {
						type: 'error',
						size: 'small'
					},
					on: {
						click: (e) => {
							that.remove(cloneObj(params.row))
							CancelBubble(e)
						}
					}
				}, '删除')
			]);
		}
	}]
}

//用户管理
export function userManagementThead(that) {
	return [{
		title: '用户头像',
		key: 'facepic',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.facepic
			if(str) {
				return h('div', {
					style: {
						width: '30px',
						height: '30px',
						margin: '0 auto'
					},
					attrs: {
						src: `${httpUrl}${str}`
					}
				}, [
					h('img', {
						style: {
							width: '30px',
							height: '30px',
							left: '30px',
							zIndex: 10
						},
						attrs: {
							src: `${httpUrl}${str}`
						},
						class: {
							'table-userImg': true
						}
					})
				])
			} else {
				return h('div', {
					style: {
						width: '30px',
						height: '30px',
						margin: '0 auto',
						//						position: 'relative'
					},
					attrs: {
						src: `${httpUrl}${str}`
					}
				}, [
					h('div', {
						style: {
							width: '30px',
							height: '30px',
							backgroundColor: 'lightGray',
							textAlign: 'center',
							lineHeight: '30px',
							left: '30px',
							zIndex: 10
						},
						class: {
							'table-userImg': true
						}
					}, [
						h('div', {
							style: {
								width: '30px',
								height: '30px',
								color: 'white'
							},
							class: {
								'iconfont': true,
								'icon-yonghu': true
							}
						})
					])
				]);
			}

		}
	}, {
		title: '手机号码',
		key: 'username',
		align: 'center',
		width: 150,
		render: (h, params) => {
			let str = params.row.username
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '真实姓名',
		key: 'realname',
		width: 80,
		align: 'center',
		render: (h, params) => {
			let str = params.row.realname
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '用户职位',
		key: 'role',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.role
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '用户属性',
		key: 'identification',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.job
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '所在单位',
		key: 'institution',
		//	align: 'center',
		render: (h, params) => {
			let str = params.row.institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '审核状态',
		key: 'institution',
		width: 80,
		align: 'center',
		render: (h, params) => {
			let str = params.row.audit_status
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '操作',
		key: 'action',
		width: 210,
		align: 'center',
		render: (h, params) => {
			let disable = null
			if(!params.row.facepic || params.row.audit_status === '通过') {
				disable = true
			} else {
				disable = false
			}
			return h('div', [
				h('Button', {
					props: {
						type: 'error',
						size: 'small',
						disabled: disable
					},
					style: {
						marginRight: '5px'
					},
					on: {
						click: () => {
							let data = cloneObj(params.row)
							that.audit(data)
						}
					}
				}, '审核'),
				h('Button', {
					props: {
						type: 'primary',
						size: 'small'
					},
					on: {
						click: () => {
							let data = cloneObj(params.row)
							delete data['_index']
							delete data['_rowKey']
							that.edit(data)
						}
					}
				}, '编辑'),
				h('Button', {
					props: {
						type: 'error',
						size: 'small'
					},
					style: {
						margin: '0 5px'
					},
					on: {
						click: () => {
							that.remove(cloneObj(params.row))
						}
					}
				}, '删除'),
				h('Button', {
					props: {
						type: 'primary',
						size: 'small'
					},
					on: {
						click: () => {
							that.resetPsw(cloneObj(params.row))
						}
					}
				}, '重置密码')
			]);
		}
	}]
}

//隐患管理
import dangerStatus from 'components/danger-management/danger-status';

export function dangerManagementThead(that) {
	return [{
		type: 'expand',
		width: 50,
		render: (h, params) => {
			return h(dangerStatus, {
				props: {
					row: params.row
				}
			})
		}
	}, {
		title: '片区',
		key: 'name',
		width: 80,
		align: 'center',
		render: (h, params) => {
			let str = params.row.construction.area
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '工地名称',
		key: 'name',
		render: (h, params) => {
			let str = params.row.construction.name
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '巡查人员',
		key: 'name',
		width: 80,
		align: 'center',
		render: (h, params) => {
			let str = params.row.inspector.realname
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '监理单位',
		key: 'name',
		render: (h, params) => {
			let str = params.row.construction.supervisor.institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '施工单位',
		key: 'name',
		render: (h, params) => {
			let str = params.row.construction.constructor.institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '隐患上报时间',
		key: 'name',
		align: 'center',
		width: 150,
		render: (h, params) => {
			let str = params.row.date_time
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '整改期限',
		key: 'name',
		align: 'center',
		width: 90,
		render: (h, params) => {
			let row = params.row
			let str = `${row.timeout}天`
			
			let time = new Date(row.date_time)
			let timeOut = row.timeout * 24 * 3600 * 1000
			let sureTime = row.pm_confirm_time !== '' ? new Date(row.pm_confirm_time) : new Date()
			time.setDate(time.getDate() + row.timeout)
			if(time.getTime()  <= sureTime.getTime()) {
				str += '<span style="color: red">(超时)</span>'
			}
			return h('div', {
				'class': {
					'table-warpper': true
				},
				domProps: {
					innerHTML: str
				}
			})
		}
	}, {
		title: '操作',
		key: 'action',
		width: 80,
		align: 'center',
		render: (h, params) => {
			return h('div', [
				h('Button', {
					props: {
						type: 'primary',
						size: 'small'
					},
					style: {
						marginRight: '5px'
					},
					on: {
						click: () => {
							that.show(params.row)
						}
					}
				}, '详情')
			]);
		}
	}]
}

//考勤记录
export function attendanceThead(that, isAction = true) {
	let arr = [{
		title: '工地片区',
		key: 'construction_area',
		width: 80,
		align: 'center',
		render: (h, params) => {
			let str = params.row.construction.area
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '所属工地',
		key: 'construction_name',
		render: (h, params) => {
			let str = params.row.construction.name
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '用户姓名',
		key: 'user_name',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.user.realname
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '手机号码',
		key: 'user_phone',
		align: 'center',
		width: 130,
		render: (h, params) => {
			let str = params.row.user.username
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '职位/属性',
		key: 'user_job',
		align: 'center',
		width: 130,
		render: (h, params) => {
			let str = `${params.row.user.role}/${params.row.user.job}`
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '坐标',
		key: 'user_local',
		align: 'center',
		render: (h, params) => {
			let str = `(${params.row.lat}, ${params.row.lnt})`
			return h('div', {
				'class': {
					'table-warpper': true,
					'attendance-local': true
				},
				attrs: {
					title: str
				},
				on: {
					click: () => {
						that.showMap(params.row)
					}
				}
			}, str)
		}
	}, {
		title: '打卡时间',
		key: 'user_time',
		align: 'center',
		width: 140,
		render: (h, params) => {
			let str = params.row.date_time
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '打卡状态',
		key: 'user_state',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.state
			let bol = false
			if(str === '失败') {
				bol = true
			}
			return h('div', {
				'class': {
					'table-warpper': true,
					'fail-color': bol
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}]

	if(isAction) {
		arr.push({
			title: '操作',
			key: 'action',
			align: 'center',
			width: 130,
			render: (h, params) => {
				let disable = true
				if(params.row.state === '失败') {
					disable = false
				}
				return h('div', [
					h('Button', {
						props: {
							type: 'error',
							size: 'small',
							disabled: disable
						},
						style: {
							marginRight: '5px'
						},
						on: {
							click: () => {
								let data = cloneObj(params.row)
								that.audit(data)
							}
						}
					}, '审核'),
					h('Button', {
						props: {
							type: 'primary',
							size: 'small'
						},
						style: {
							marginRight: '5px'
						},
						on: {
							click: () => {
								let data = cloneObj(params.row)
								that.showAudit(data)
							}
						}
					}, '查看')
				]);
			}
		});
	}

	return arr
}

//巡查任务管理
import patrolMissionExpand from 'base/patrol-mission-expand/patrol-mission-expand';

export function patrolMissionThead(that) {
	return [{
		title: '工地名称',
		key: 'name',
		//	align: 'center',
		render: (h, params) => {
			let str = params.row.construction.name
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '工地地址',
		key: 'address',
		//	align: 'center',
		render: (h, params) => {
			let str = params.row.construction.address
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '片区',
		key: 'area',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.construction.area
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '施工单位',
		key: 'name',
		//	align: 'center', 
		render: (h, params) => {
			let str = params.row.construction.constructor.institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '监管单位',
		key: 'name',
		//	align: 'center',
		render: (h, params) => {
			let str = params.row.construction.supervisor.institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '巡查员',
		key: 'name',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.inspector.realname
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '巡查时间',
		key: 'datetime',
		align: 'center',
		width: 140,
		render: (h, params) => {
			let str = params.row.date_time
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '状态',
		key: 'state',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.state
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '操作',
		key: 'action',
		align: 'center',
		width: 80,
		render: (h, params) => {
			return h('Button', {
				props: {
					type: 'primary',
					size: 'small',
				},
				style: {
					marginRight: '5px'
				},
				on: {
					click: () => {
						window.open(`${location.origin}${location.pathname}#/dangerList/${params.row.taskid}`, '_blank')
					}
				}
			}, '详情')
		}
	}]
}

//历史巡查管理
export function patrolHistoryThead(that) {
	return [{
		title: '工地名称',
		key: 'name',
		render: (h, params) => {
			let str = params.row.name
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '片区',
		key: 'address',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.area
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '年月份',
		key: 'name',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.ym
			if(str.length > 7) {
				str = str.substring(0, str.length - likeSearchRule.length)
			}
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '巡查次数',
		key: 'area',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.patrolCount
			return h('div', {
				'class': {
					'table-warpper': true
				},
				style: {
					cursor: 'pointer',
					color: '#008cee',
					textDecoration: 'underline'
				},
				attrs: {
					title: str
				},
				on: {
					click: () => {
						that.goDetail(params.row)
					}
				}
			}, str)
		}
	}, {
		title: '巡查人员',
		key: 'name',
		align: 'center',
		width: 80,
		render: (h, params) => {
			let str = params.row.inspector.realname
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '施工单位',
		key: 'name',
		render: (h, params) => {
			let str = params.row.constructor.institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '监理单位',
		key: 'name',
		render: (h, params) => {
			let str = params.row.supervisor.institution
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}]
}

export const patrolTrackThead = [{
	title: '巡查时间',
	key: 'datetime',
	align: 'center',
	render: (h, params) => {
		let str = params.row.date_time
		return h('div', {
			'class': {
				'table-warpper': true
			},
			attrs: {
				title: str
			}
		}, str)
	}
}]

export function noticeManagementThead(that) {
	return [{
		type: 'index',
		width: 60,
		align: 'center'
	}, {
		title: '公告标题',
		key: 'realname',
		render: (h, params) => {
			let str = params.row.notice_title
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '公告类型',
		key: 'institution',
		align: 'center',
		render: (h, params) => {
			let str = params.row.notice_category
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '创建人',
		key: 'phone',
		align: 'center',
		render: (h, params) => {
			let str = params.row.creator.realname
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '创建时间',
		key: 'role',
		align: 'center',
		render: (h, params) => {
			let str = params.row.create_time
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '修改时间',
		key: 'identification',
		align: 'center',
		render: (h, params) => {
			let str = params.row.update_time
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '状态',
		key: 'identification',
		align: 'center',
		render: (h, params) => {
			let str = +params.row.state
			str = str === 1 ? '显示' : '不显示'
			return h('div', {
				'class': {
					'table-warpper': true
				},
				attrs: {
					title: str
				}
			}, str)
		}
	}, {
		title: '操作',
		key: 'action',
		width: 180,
		align: 'center',
		render: (h, params) => {
			return h('div', [
				h('Button', {
					props: {
						type: 'primary',
						size: 'small'
					},
					on: {
						click: () => {
							window.open(`${location.origin}${location.pathname}#/noticeRead/${params.row.noticeid}`, '_blank')
						}
					}
				}, '预览'),
				h('Button', {
					props: {
						type: 'primary',
						size: 'small'
					},
					style: {
						margin: '0 5px'
					},
					on: {
						click: () => {
							let data = cloneObj(params.row)
							delete data['_index']
							delete data['_rowKey']
							that.edit(data)
						}
					}
				}, '编辑'),
				h('Button', {
					props: {
						type: 'error',
						size: 'small'
					},
					on: {
						click: () => {
							that.remove(cloneObj(params.row))
						}
					}
				}, '删除')
			]);
		}
	}]
}