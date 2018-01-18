import { ajaxPost } from 'api/axios'
import { options } from 'api/config'

export function getUserAll(search) {
	let url = 'user/list'

	let data = {
		searchValue: {
			...search			
		}
	}

	return ajaxPost(url, data, options())
}

export function getMissionList(search = {}) {
	let url = 'patrol/list'
	
	let data = {
		searchValue: {
			...search
		}
	}
	
	return ajaxPost(url, data, options())
}