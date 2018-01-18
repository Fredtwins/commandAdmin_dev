import { ajaxGet, ajaxPost } from 'api/axios'
import { options } from 'api/config'
import { likeSearch } from 'common/js/util'

export function getAttendanceList(page = 1, search = {}) {
	let url = 'workcheck/list'
	
	let data = {
		page: page,
		pageSize: 10,
		searchValue: {
			...likeSearch(search)
		},
		order: {
			date_time: -1
		}
	}
	
	return ajaxPost(url, data, options())
}

export function getAttendanceExportList(month) {
	let url = 'workcheck/list'
	
	let data = {
		searchValue: {
			'ym': month
		},
		order: {
			'construction.area': -1,
			'construction.name': -1,
			'role': -1,
			'job': -1
		}
	}
	
	return ajaxPost(url, data, options())
}

export function getSingleAttendanceList(search = {}) {
	let url = 'workcheck/list'
	
	let data = {
		searchValue: {
			...search
		},
		order: {
			date_time: -1
		}
	}
	
	return ajaxPost(url, data, options())
}

export function updateAttendanceState(id) {
	let url = 'workcheck/tosuccess'
	
	let data = {
		checkid: id
	}
	
	return ajaxPost(url, data, options())
}

