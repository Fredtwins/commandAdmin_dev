import { ajaxGet, ajaxPost } from 'api/axios'
import { options } from 'api/config'
import { likeSearch } from 'common/js/util'

export function getMissionHistoryList(page = 1, search = {}) {
	let url = 'patrol/statistics'
	
	let data = {
		page: page,
		pageSize: 10,
		searchValue: {
			...likeSearch(search)
		},
		order: {
			ym: -1,
			start_time: -1
		}
	}
	
	return ajaxPost(url, data, options())
}
