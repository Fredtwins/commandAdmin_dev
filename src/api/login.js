import { ajaxPost } from 'api/axios'

export function goLogin(obj) {
	let url = 'user/login'
	
	return ajaxPost(url, obj)
}
