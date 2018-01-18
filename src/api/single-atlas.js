import { ajaxGet, ajaxPost } from 'api/axios'
import { options } from 'api/config'

export function getAtlasList(search = {}) {
	let url = 'patrol/construction_atlas'
	
	let data = {
		...search
	}
	
	return ajaxPost(url, data, options())
}

export function getTaskAtlasList(search = {}) {
	let url = 'construction/construction_buildatlas'
	
	let data = {
		...search
	}
	
	return ajaxPost(url, data, options())
}
