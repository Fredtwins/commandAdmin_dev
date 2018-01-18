import { ajaxGet, ajaxPost } from 'api/axios'
import { options } from 'api/config'
import { likeSearch } from 'common/js/util'

export function getUserList(page = 1, search = {}) {
	let url = 'user/list'
	
	let data = {
		page: page,
		pageSize: 10,
		searchValue: {
			...search
		},
		order: {
			_id: -1
		}
	}
	
	return ajaxPost(url, data, options())
}

export function getOgnList() {
	let url = 'user/listInstitution'
	
	let data = {}
	
	return ajaxPost(url, data, options())
}

export function updateUserList(type, data) {
	let url = `user/${type}`
	
	return ajaxPost(url, data, options())
}

export function updateUserPsw(data) {
	let url = 'user/changePassword'
	
	return ajaxPost(url, data, options())
}

export function resetUserPsw(data) {
	let url = 'user/initPassword'
	
	return ajaxPost(url, data, options())
}

export function updateUserAudit(data) {
	let url = 'user/changeAuditStatus'
	
	return ajaxPost(url, data, options())
}

