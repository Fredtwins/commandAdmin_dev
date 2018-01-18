import { ajaxAll, ajaxPost } from 'api/axios'
import { options } from 'api/config'
import { likeSearch } from 'common/js/util'

export function getTaskList(page = 1, search = {}) {
	let url = 'construction/list'

	let data = {
		page: page,
		pageSize: 10,
		searchValue: {
			...likeSearch(search)
		},
		order: {
			_id: -1
		}
	}

	return ajaxPost(url, data, options())
}

export function getTaskAllList() {
	let url = 'construction/list'

	let data = {}

	return ajaxPost(url, data, options())
}

export function updateTaskList(type, data) {
	let url = `construction/${type}`
	
	return ajaxPost(url, data, options())
}

export function getUserAll() {
	let url = 'user/list'

	let data = {}

	return ajaxPost(url, data, options())
}

export function editTask(search = {}) {
	let arr = [{
		method: 'post',
		url: 'user/list',
		data: {}
	}, {
		method: 'post',
		url: 'user/listInstitution',
		data: {
			page: 1,
			pageSize: 10,
			searchValue: {
				...search
			}
		}
	}, {
		method: 'post',
		url: 'construction/list',
		data: {
			page: 1,
			pageSize: 10,
			searchValue: {
				...search
			}
		}
	}]
	
	return ajaxAll(arr, options())
}

export function getFormData() {
	let arr = [{
		method: 'post',
		url: 'user/list',
		data: {}
	}, {
		method: 'post',
		url: 'user/listInstitution',
		data: {}
	}]
	
	return ajaxAll(arr, options())
}
