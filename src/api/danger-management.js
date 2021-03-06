import { ajaxGet, ajaxPost } from 'api/axios'
import { options } from 'api/config'
import { likeSearch } from 'common/js/util'

export function getMissionList(page = 1, search = {}) {
	let url = 'patrol/list'
	
	let data = {
		page: page,
		pageSize: 10,
		searchValue: {
			...likeSearch(search),
			state: '有隐患'
		},
		order: {
			date_time: -1
		}
	}
	
	return ajaxPost(url, data, options())
}