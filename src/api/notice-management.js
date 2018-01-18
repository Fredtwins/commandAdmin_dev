import { ajaxGet, ajaxPost } from 'api/axios'
import { options } from 'api/config'
import { likeSearch } from 'common/js/util'

export function getNoticeList(page = 1, search = {}) {
	let url = 'notice/list'

	let data = {
		page: page,
		pageSize: 10,
		searchValue: {
			...search
		},
		order: {
			create_time: -1
		}
	}

	return ajaxPost(url, data, options())
}

export function updateNoticeList(type, data) {
	let url = `notice/${type}`
	
	return ajaxPost(url, data, options())
}

export function getNotice(str = '') {
	let url = 'notice/find'

	let data = {
		noticeid: str
	}

	return ajaxPost(url, data)
}